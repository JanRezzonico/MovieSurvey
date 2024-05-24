import Lobby from "../mongoose/models/Lobby";
import * as dotenv from "dotenv";
dotenv.config();

const CODE_LENGTH = parseInt(process.env.CODE_LENGTH ?? "4");
const generateLobbyCode = async () => {
    let code = '';
    do {
        for (let i = 0; i < CODE_LENGTH; i++) { code += randomChar(); }
    } while (!!(await (Lobby.findOne({ code }))))
    return code;
};

const randomChar = () => {
    //https://en.wikipedia.org/wiki/List_of_Unicode_characters#Basic_Latin
    //48-57 numbers, 65-90 capital letters, number generated is from 48 to 83
    let char = Math.floor(Math.random() * 36) + 48;
    if (char > 57) { //58-64 are ASCII Punctuation and Symbols 
        char += 7; //In this case we add 7 to shift into the numbers instead of the symbols
    }
    return String.fromCharCode(char);
}

export default generateLobbyCode;