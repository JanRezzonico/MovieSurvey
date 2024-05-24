import { Schema, Types, model } from "mongoose";
import ILobby from "../interfaces/ILobby";

const lobby = new Schema<ILobby>({
  code: {
    type: String,
    required: true
  },
  admin: {
    type: String,
    required: true
  } /* Socket id of the admin */,
  users: [{
    socket_id: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    current_movie: {
      type: Number,
      required: true,
      default: 0
    }
  }],
  movies: [{
    external_id: {
      type: Number,
      required: true
    },
    positive_count: {
      type: Number,
      required: true,
      default: 0
    },
    negative_count: {
      type: Number,
      required: true,
      default: 0
    },
    default: []
  }],
  movie_cache: [{
    external_id: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    cover: {
      type: String,
      required: true
    },
    year: {
      type: String,
      required: true
    },
    genres: [{
      type: String,
      required: true
    }],
    description: {
      type: String,
      required: true
    },
    default: []
  }],
  lists: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: "List"
  }],
  status: {
    type: String,
    enum: ['waiting', 'started', 'scoreboard'],
    required: true,
    default: 'waiting'
  }
});

export default model('Lobby', lobby);