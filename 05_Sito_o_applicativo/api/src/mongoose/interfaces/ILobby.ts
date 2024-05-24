import { Types } from "mongoose";

// This interface was generated with AI, starting from the mongoose schema, to make the process quicker

interface ILobby {
    code: string;
    admin: string; // Socket id of the admin
    users: {
        socket_id: string;
        username: string;
        current_movie: number;
    }[];
    movies: {
        external_id: number;
        positive_count: number;
        negative_count: number;
    }[];
    movie_cache: {
        external_id: number;
        title: string;
        cover: string;
        year: string;
        genres: string[];
        description: string;
    }[];
    lists: Types.ObjectId[];
    status: string
};

export default ILobby;