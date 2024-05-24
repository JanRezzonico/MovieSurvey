import mongoose from "mongoose";
import * as dotenv from "dotenv";
import io from "./socket";
import List from "./mongoose/models/List";

dotenv.config();

mongoose.connect(process.env.MONGO_URI ?? "")
    .then(() => {
        console.log("Connected to MongoDB")
        List.deleteMany({}).then(() => {
            const lists = require("./../assets/lists.json");
            List.insertMany(lists).then(() => {
                console.log("Inserted lists into database");
            }).catch((err) => {
                console.error(err);
            });
        })
    })
    .catch((err) => { console.error(err) });




io.listen(parseInt(process.env.PORT ?? "3000"));

io.disconnectSockets(); // Disconnect all sockets when the server starts, this is useful for development purposes