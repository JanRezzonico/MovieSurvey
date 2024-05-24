import axios from "axios"
import * as dotenv from "dotenv"
import { Socket } from "socket.io";

dotenv.config()

const movie = {
    trailer: (socket: Socket) => async (movieId: string, callback: Function) => {
        const response = await axios.get(
            process.env.TMDB_BASE_URL + `movie/${movieId}/videos`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                    Accept: 'application/json'
                },
            }
        );
        if (response.status === 200) {
            const trailer = response.data.results.find((video: any) => video.type === "Trailer");
            if (trailer) {
                callback("https://www.youtube.com/watch?v=" + trailer.key);
            } else {
                if (response.data.results.length > 0) {
                    callback("https://www.youtube.com/watch?v=" + response.data.results[0].key);
                } else {
                    callback(null);
                }
            }
        }
    }
}

export default movie;