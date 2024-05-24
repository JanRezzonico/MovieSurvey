import { Socket } from "socket.io";
import { VoteParam } from "./interfaces";
import Lobby from "../mongoose/models/Lobby";
import io from ".";
import makeScoreboard from "../helpers/scoreboard";
import { getScoreboard, setScoreboard } from "../helpers/scoreboardStorage";
import { addVote, addVotesToDatabase } from "../helpers/voteStorage";

const vote = {
    vote: (socket: Socket) => async ({ roomCode, movieId, vote }: VoteParam) => {
        const lobby = await Lobby.findOne({ code: roomCode });
        if (!lobby) {
            socket.emit("vote:error", { message: "The provided roomId does not match any existing room" });
            return;
        }
        const index = addVote(socket.id, movieId, vote);
        /*
        index is the index of the movie voted right now, this means that index + 1 is the next movie
        that the user already recieved but still has to vote
        we want to trigger the vote:completed when the user has voted on all movies, but
        /we also want to stop sending movies 1 step before triggering the vote:completed
        */
        const moviesLeftToVote = lobby.movie_cache.length - index - 1;
        if (moviesLeftToVote === 0) {
            socket.emit("vote:completed");
            await addVotesToDatabase(socket.id, roomCode);
            const updatedLobby = await Lobby.findById(lobby._id);
            if (!updatedLobby) {
                return;
            }
            //If all users have voted on all movies, we can generate the scoreboard
            if (updatedLobby.users.every((user) => user.current_movie === updatedLobby.movie_cache.length - 1)) {
                const scoreboard = await makeScoreboard(updatedLobby._id);
                if (!scoreboard) {
                    io.to(updatedLobby.code).emit("vote:error", { message: "The scoreboard could not be generated" });
                    return;
                }
                setScoreboard(updatedLobby._id, scoreboard);
                updatedLobby.status = "scoreboard";
                await updatedLobby.save();
                io.to(updatedLobby.code).emit("vote:scoreboard", { scoreboard });
            }
            return;
        } else if (moviesLeftToVote === 1) {
            //If there is only one movie left to vote on, we already sent it so we don't have to do anything
            socket.emit("vote:next");
        } else {
            const movie = lobby.movie_cache[index + 2]; //+1 means the next movie, but we want the one after that
            socket.emit("vote:next", { movie });
        }
    }
}

export default vote;