import { Socket } from "socket.io";
import { JoinParams, CreateParams, UpdateListsParams } from "./interfaces";
import generateLobbyCode from "../helpers/lobbyCodeGenerator";
import Lobby from "../mongoose/models/Lobby";
import io from "./index";
import List from "../mongoose/models/List";
import addMoviesToCache from "../helpers/movieFetcher";
import { status } from "../mongoose/interfaces/status";
import { deleteScoreboard, getScoreboard } from "../helpers/scoreboardStorage";
import roomMap from "../helpers/roomMap";
import { deleteSocketVotes } from "../helpers/voteStorage";

const lobby = {
    join: (socket: Socket) => async ({ lobbyCode, username }: JoinParams) => {
        const lobby = await Lobby.findOne({ code: lobbyCode });
        if (!lobby) {
            socket.emit("lobby:error", { message: `No lobby with code ${lobbyCode} was found` });
            return;
        }
        lobby.users.push({ socket_id: socket.id, username: username, current_movie: 0 });
        await lobby.save();
        socket.join(lobbyCode);
        roomMap.set(socket.id, lobbyCode);
        socket.emit("lobby:joined", { admin: false, users: lobby.users.map(u => u.username), code: lobbyCode });
        // sending to all clients in room except sender
        socket.broadcast.to(lobbyCode).emit("lobby:update", { users: lobby.users.map(u => u.username) });
        if (lobby.status === status.started) {
            socket.emit("vote:start", { movie: lobby.movie_cache[0] });
            await new Promise((resolve) => setTimeout(resolve, 1000));
            socket.emit("vote:next", { movie: lobby.movie_cache[1] });
            return;
        }
        if (lobby.status === status.scoreboard) {
            socket.emit("vote:scoreboard", { scoreboard: getScoreboard(lobby._id) });
        }
    },
    quit: (socket: Socket) => async () => {
        const room = roomMap.get(socket.id);
        if (!room) {
            return;
        }
        //If user is the lobby admin, destroy the room
        const lobby = await Lobby.findOne({ code: room });
        if (!lobby) {
            return;
        }
        lobby.users.splice(lobby.users.findIndex((u) => u.socket_id === socket.id), 1);
        await lobby.save();
        // sending to all clients in room except sender
        socket.broadcast.to(room).emit("lobby:update", { users: lobby.users.map(u => u.username) });
        const adminQuit = lobby.admin === socket.id;
        const oneUserInNonWaitingLobby = lobby.users.length <= 1 && lobby.status !== status.waiting;
        if (adminQuit || oneUserInNonWaitingLobby) {
            await Lobby.deleteOne({ code: room });
            io.to(room).emit("lobby:destroyed");
            console.log("Destroyed lobby", room);
            deleteScoreboard(lobby._id);
        }
        socket.leave(room); //Socket.io automatically leaves the room but we do it manually to make sure
        roomMap.delete(socket.id);
        deleteSocketVotes(socket.id);
    },
    create: (socket: Socket) => async ({ username }: CreateParams) => {
        const lobbyCode = await generateLobbyCode(); //This already takes care of the code being unique
        const lobby = await Lobby.create({ admin: socket.id, code: lobbyCode, users: [{ socket_id: socket.id, username: username }] });
        socket.join(lobbyCode);
        roomMap.set(socket.id, lobbyCode);
        socket.emit("lobby:joined", { admin: true, users: lobby.users.map(u => u.username), code: lobbyCode });
    },
    start: (socket: Socket) => async () => {
        const lobby = await Lobby.findOne({ admin: socket.id });
        if (!lobby) {
            socket.emit("lobby:error", { message: "You are not a lobby administrator" });
            return;
        }
        await addMoviesToCache(lobby._id);
        lobby.status = status.started;
        await lobby.save();
        const updatedLobby = await Lobby.findById(lobby._id); //Fetch the lobby again to get the updated movie cache
        if (updatedLobby) { //Make ts happy
            io.to(lobby.code).emit("vote:start", { movie: updatedLobby.movie_cache[0] });
            //Sleep for 1 second to make sure the client has time to load the vote page
            //If we don't wait, the client won't recieve the vote:next event since it hasn't loaded the vote page
            //which contains the listener for the vote:next event
            await new Promise((resolve) => setTimeout(resolve, 1000));
            io.to(lobby.code).emit("vote:next", { movie: updatedLobby.movie_cache[1] });
            await updatedLobby.save();
        }
    },
    updateList: (socket: Socket) => async ({ id, status }: UpdateListsParams) => {
        const lobby = await Lobby.findOne({ admin: socket.id });
        if (!lobby) {
            socket.emit("lobby:error", { message: "You are not a lobby administrator" });
            return;
        }
        const list = await List.findById(id);
        if (!list) {
            socket.emit("lobby:error", { message: `List with id ${id} does not exist` });
            return;
        }

        //If the list is in the lobby and the status is false, remove it. If the list is not in the lobby and the status is true, add it
        if (lobby.lists.includes(id) && !status) {
            lobby.lists.splice(lobby.lists.indexOf(id), 1);
        } else if (!lobby.lists.includes(id) && status) {
            lobby.lists.push(id);
        }
        await lobby.save();
    },
    fetchLists: (socket: Socket) => async (callback: Function) => {
        const lists = await List.find({});
        const lobby = await Lobby.findOne({ admin: socket.id });
        if (!lobby) {
            socket.emit("lobby:error", { message: "You are not a lobby administrator" });
            return;
        }
        const mappedLists = lists.map(({ _id, name }) => { return { id: _id, name, status: lobby.lists.includes(_id) } });
        callback(mappedLists);
    },
    startNewIteration: (socket: Socket) => async () => {
        const lobby = await Lobby.findOne({ admin: socket.id });
        if (!lobby) {
            socket.emit("lobby:error", { message: "You are not a lobby administrator" });
            return;
        }
        if (lobby.status !== status.scoreboard) {
            socket.emit("lobby:error", { message: "Lobby is not in scoreboard state" });
            return;
        }
        const bestAmount = Math.max(lobby.movies.length * 0.20, 5); // Keep either 20% of the movies or 10, whichever is higher
        //Keep only the best movies
        const bestMovies = lobby.movies.sort((a, b) => b.positive_count - a.positive_count).slice(0, bestAmount);
        //Reset the votes
        lobby.movies = [];
        await lobby.save();
        //Keep in the movie cache only the movies kept in the previous step
        lobby.movie_cache = lobby.movie_cache.filter(({ external_id }) => bestMovies.find(({ external_id: id }) => id === external_id));
        lobby.status = status.started;
        lobby.users.forEach(u => u.current_movie = 0);
        await lobby.save();
        io.to(lobby.code).emit("vote:start", { movie: lobby.movie_cache[0] });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        io.to(lobby.code).emit("vote:next", { movie: lobby.movie_cache[1] });
        deleteScoreboard(lobby._id);
    }
}

export default lobby;