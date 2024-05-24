import { Types } from "mongoose";
import Lobby from "../mongoose/models/Lobby";
import List from "../mongoose/models/List";
import axios from "axios";
import { GenreObject } from "./interfaces";
import * as dotenv from "dotenv";
dotenv.config();

let genres = Array<GenreObject>(); //Keep outside of function scope as a way to cache it
const PAGES = parseInt(process.env.PAGES_REQUESTED || "2");
const MAX_MOVIES = parseInt(process.env.MAX_MOVIES || "50");

const addMoviesToCache = async (lobbyId: Types.ObjectId): Promise<boolean> => {
    const lobby = await Lobby.findById(lobbyId);
    if (!lobby) {
        return false;
    }
    //If no list is selected, select the trending list
    if (lobby.lists.length === 0) {
        const trending = await List.findOne({ name: 'Trending' });
        if (!trending) {
            console.log("Trending list does not exist");
            return false;
        }
        lobby.lists.push(trending._id);
        await lobby.save();
    }
    await Promise.all(
        lobby.lists.map(async (id) => {
            const list = await List.findById(id);
            if (!list) {
                console.log(`Attempt to read list with id ${id}`);
                return;
            }
            const filters = list.filters || {};
            const movies = await fetchMovies(filters, PAGES);
            if (!movies) {
                console.log(`Failed to fetch movies for list ${list.name}`);
                return;
            }
            const standardizedMovies = await Promise.all(movies.map(async (movie: any) => {
                const genres = await getGenres(movie.genre_ids);
                if (!genres) {
                    console.log(`Failed to get genres for movie ${movie.title}`);
                }
                const cover = (movie.poster_path ?? movie.backdrop_path ?? null);

                return {
                    external_id: parseInt(movie.id),
                    title: String(movie.title),
                    cover: cover ? process.env.TMDB_IMAGE_URL + cover : null,
                    year: String(movie.release_date.split('-')[0]),
                    genres: genres || [],
                    description: String(movie.overview)
                }
            }));
            const filtered = standardizedMovies
                .filter((m) => !lobby.movie_cache.some((existingMovie) => existingMovie.external_id === m.external_id)) //Don't add duplicates
                .filter((m) => !!m.cover && !!m.genres && !!m.year && !!m.description);
            lobby.movie_cache.push(...filtered);
        })
    );
    lobby.movie_cache.sort(() => Math.random() - 0.5);//Shuffle
    lobby.movie_cache = lobby.movie_cache.slice(0, MAX_MOVIES);//Keep only a set amount of movies
    await lobby.save();
    console.log(lobby.movie_cache.length, "movies added to cacheeeeee")
    return true;
}

const fetchMovies = async (filters: any, pages: number): Promise<Array<any> | null> => {
    const fetchPage = async (page: number): Promise<Array<any> | null> => {
        const response = await axios.get(
            process.env.TMDB_BASE_URL + '/discover/movie',
            {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                    Accept: 'application/json'
                },
                params: {
                    ...filters,
                    page: page,
                    'primary_release_date.lte': new Date().toISOString().split('T')[0] // Get only movies that have come out
                }
            }
        );
        switch (response.status) {
            case 200:
                return response.data.results;
            case 401:
                console.log("Unauthorized request to TMDB API");
                return null;
            case 429:
                console.log("Rate limit exceeded for TMDB API");
                return null;
            default:
                console.log(`Error fetching movies from TMDB API: ${response.status}`);
                return null;
        }
    }
    let movies = Array<any>();
    for (let i = 1; i <= pages; i++) {
        const page = await fetchPage(i);
        if (!page) {
            return null;
        }
        movies.push(...page);
    }
    return movies;
}

const fetchGenres = async (): Promise<Array<GenreObject> | null> => {
    const responseMovie = await axios.get(
        process.env.TMDB_BASE_URL + '/genre/movie/list',
        {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                Accept: 'application/json'
            }
        }
    );
    const responseTv = await axios.get(
        process.env.TMDB_BASE_URL + '/genre/tv/list',
        {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                Accept: 'application/json'
            }
        }
    );
    const genres = [];
    switch (responseMovie.status) {
        case 200:
            genres.push(...responseMovie.data.genres);
            break;
        case 401:
            console.log("Unauthorized request to TMDB API");
            return null;
        case 429:
            console.log("Rate limit exceeded for TMDB API");
            return null;
        default:
            console.log(`Error fetching genres from TMDB API: ${responseMovie.status}`);
            return null;
    }
    switch (responseTv.status) {
        case 200:
            genres.push(...responseTv.data.genres);
            break;
        case 401:
            console.log("Unauthorized request to TMDB API");
            return null;
        case 429:
            console.log("Rate limit exceeded for TMDB API");
            return null;
        default:
            console.log(`Error fetching genres from TMDB API: ${responseTv.status}`);
            return null;
    }
    return genres;
}

const getGenres = async (ids: Array<Number>): Promise<Array<string> | null> => {
    if (genres.length === 0) {
        const fetched = await fetchGenres();
        if (!fetched) {
            return null;
        }
        genres = fetched;
    }
    const filtered = genres.filter((g) => ids.includes(g.id)).map((g) => g.name);
    return filtered.filter((value, index) => filtered.indexOf(value) === index);
}

export default addMoviesToCache;