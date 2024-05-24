import { getRoomCode } from "../../storage/roomCode";
import { StyleSheet } from "react-native";
import SText from "./SText";
import FontSize from "../../constants/FontSize";

const RoomCode = () => {
    return (
        <SText style={styles.roomCode}>{getRoomCode()}</SText>
    );
};

const styles = StyleSheet.create({
    roomCode: {
        alignSelf: 'center',
        fontSize: FontSize.title,
        marginTop: '5%',
        fontFamily: 'FiraMono'
    }
});

export default RoomCode;