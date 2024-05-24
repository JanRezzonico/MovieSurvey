export interface GenreObject {
    id: number;
    name: string;
}

export interface ScoreboardField {
    score: string;
    external_id: number;
    title: string;
    year: string;
    genres: string[];
}

export interface VoteKey {
    socketId: string;
    movieId: number;
}