import { Schema, model } from "mongoose";
import IList from "../interfaces/IList";

const list = new Schema<IList>({
    name: {
        type: String,
        required: true
    },
    filters: {
        type: Schema.Types.Mixed,
        required: true,
        default: {}
    }
});

export default model('List', list);
