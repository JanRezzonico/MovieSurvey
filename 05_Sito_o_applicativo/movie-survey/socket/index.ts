import { io } from "socket.io-client";
import lobby from "./listeners/lobby";
import vote from "./listeners/vote";
import connection from "./listeners/connection";

const socket = io(process.env.EXPO_PUBLIC_SOCKET_SERVER_URI || "", { timeout: 10000 });

socket.on('lobby:joined', lobby.joined);

// lobby:update is also listened in the lobby screen (app/lobby/index.tsx)
socket.on('lobby:update', lobby.update);

socket.on('lobby:destroyed', lobby.destroyed);

socket.on('lobby:error', lobby.error);

socket.on('connect_error', connection.connectError);

socket.on('connect', connection.connect);

socket.on('vote:start', vote.start);

socket.on('vote:error', vote.error);

socket.on('vote:scoreboard', vote.scoreboard);

socket.on('vote:completed', vote.completed);

export default socket;