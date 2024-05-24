import { Types } from "mongoose";
import { ScoreboardField } from "./interfaces";

const scoreboardMap = new Map<string, Array<ScoreboardField>>();

export const getScoreboard = (lobbyId: Types.ObjectId) => {
    return scoreboardMap.get(String(lobbyId)) || [];
};

export const setScoreboard = (lobbyId: Types.ObjectId, scoreboard: Array<ScoreboardField>) => {
    scoreboardMap.set(String(lobbyId), scoreboard);
}

export const deleteScoreboard = (lobbyId: Types.ObjectId) => {
    scoreboardMap.delete(String(lobbyId));
}