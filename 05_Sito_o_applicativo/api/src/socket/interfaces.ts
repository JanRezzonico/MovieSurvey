import { Types } from "mongoose";

export interface JoinParams {
    lobbyCode: string;
    username: string;
}
export interface CreateParams {
    username: string;
}
export interface UpdateListsParams {
    id: Types.ObjectId;
    status: boolean;
}

export interface VoteParam {
    roomCode: string;
    movieId: number;
    vote: boolean;
}