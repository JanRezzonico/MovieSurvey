import { Server, Socket } from "socket.io";
import * as dotenv from "dotenv";
import lobby from "./lobby";
import vote from "./vote";
import movie from "./movie";

const io = new Server({
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
});

io.on("connection", (socket: Socket) => {
    console.log("Connected", socket.id);
    socket.on("lobby:join", lobby.join(socket));
    socket.on("lobby:quit", lobby.quit(socket));
    socket.on("lobby:create", lobby.create(socket));
    socket.on("lobby:start", lobby.start(socket));
    socket.on("lobby:updateList", lobby.updateList(socket));
    socket.on("lobby:fetchLists", lobby.fetchLists(socket));
    socket.on("lobby:startNewIteration", lobby.startNewIteration(socket));

    socket.on("vote:vote", vote.vote(socket));

    socket.on("movie:trailer", movie.trailer(socket));

    socket.on("disconnect", () => {
        lobby.quit(socket)();
        console.log("Disconnected", socket.id);
    });
});

export default io;