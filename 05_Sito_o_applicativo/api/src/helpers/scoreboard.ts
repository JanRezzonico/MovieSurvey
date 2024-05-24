import { Types } from "mongoose";
import Lobby from "../mongoose/models/Lobby";
import { ScoreboardField } from "./interfaces";

const makeScoreboard = async (lobbyId: Types.ObjectId): Promise<Array<ScoreboardField> | null> => {
    const lobby = await Lobby.findById(lobbyId);
    if (!lobby) {
        return null;
    }
    const sortedMovies = lobby.movies.sort((a, b) => { return b.positive_count - a.positive_count });
    const cutPosition = Math.max(sortedMovies.length * 0.50, 20);
    const topMovies = sortedMovies.slice(0, cutPosition);

    return topMovies.map(({ external_id, positive_count, negative_count }) => {
        const movie = lobby.movie_cache.find(({ external_id: id }) => { return id === external_id });
        if (!movie) {
            console.log(`Movie with external_id ${external_id} was not found in the cache`);
            return null;
        }
        const { title, year, genres } = movie;
        return {
            score: `${positive_count}/${positive_count + negative_count}`,
            external_id,
            title,
            year,
            genres
        }
    }).filter((field): field is ScoreboardField => field !== null);
    //field is ScoreboardField is a type guard, it tells typescript that the object is of type ScoreboardField and not possibly null
}

export default makeScoreboard;