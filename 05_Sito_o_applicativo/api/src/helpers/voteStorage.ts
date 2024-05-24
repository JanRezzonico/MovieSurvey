import Lobby from "../mongoose/models/Lobby";
import { VoteKey } from "./interfaces";

const voteStorage = new Map<VoteKey, boolean>();

const addVotesToDatabase = async (socketId: string, code: string) => {
    const lobby = await Lobby.findOne({ code });
    if (!lobby) {
        return;
    }

    const socketVotes = Array.from(voteStorage).filter(([key]) => key.socketId === socketId);

    socketVotes.forEach(([key, vote]) => {
        const movie = lobby.movies.find((m) => m.external_id === key.movieId);
        if (!movie) {
            lobby.movies.push({ external_id: key.movieId, positive_count: vote ? 1 : 0, negative_count: vote ? 0 : 1 });
            return;
        }
        if (vote) {
            movie.positive_count++;
        } else {
            movie.negative_count++;
        }
    });
    lobby.users.find((u) => u.socket_id === socketId)!.current_movie = lobby.movie_cache.length - 1;
    // Save the lobby with all the accumulated changes
    await lobby.save();
    // Delete the votes from the storage
    socketVotes.forEach(([key]) => voteStorage.delete(key));
};

const addVote = (socketId: string, movieId: number, vote: boolean) => {
    voteStorage.set({ socketId, movieId }, vote);
    //Return the amount of votes that have socketId = socketId in the storage
    return Array.from(voteStorage).filter(([key]) => key.socketId === socketId).length;
}

const deleteSocketVotes = (socketId: string) => {
    voteStorage.forEach((_, key) => {
        if (key.socketId === socketId) {
            voteStorage.delete(key);
        }
    });
}

export { addVote, deleteSocketVotes, addVotesToDatabase };