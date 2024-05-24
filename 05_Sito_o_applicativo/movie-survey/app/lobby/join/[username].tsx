import { useLocalSearchParams } from "expo-router";
import MainView from "../../(components)/MainView";
import SText from "../../(components)/SText";
import FontSize from "../../../constants/FontSize";
import { useTranslation } from "react-i18next";
import CodeInput from "../../(components)/CodeInput";
import { useEffect, useState } from "react";
import Button from "../../(components)/Button";
import socket from "../../../socket";
import { View, StyleSheet } from "react-native";

const LobbyInsertCode = () => {
    const { t } = useTranslation();
    const { username } = useLocalSearchParams();
    const [code, setCode] = useState('');
    const [buttonIsEnabled, setButtonIsEnabled] = useState(true);
    const [waitingDoublePress, setWaitingDoublePress] = useState(false);
    const onJoinLobby = () => {
        setWaitingDoublePress(true);
        socket.emit('lobby:join', { username, lobbyCode: code });
        //Re-enable after 1 second, to prevent accidental double clicks, after this time the server should have responded
        //and if it hasn't, the user can try again
        setTimeout(() => setWaitingDoublePress(false), 1000);
    }
    useEffect(() => {
        setButtonIsEnabled(code.length === 4 && !waitingDoublePress);
    }, [code, waitingDoublePress]);
    return (
        <MainView style={styles.container}>
            <View>
                <SText style={styles.title}>{t('JOIN_LOBBY')}</SText>
                <SText style={styles.subTitle}>{t('ENTER_CODE')}</SText>
                <CodeInput code={code} setCode={setCode} />
            </View>
            <View style={styles.buttonContainer}>
                <Button enabled={buttonIsEnabled} text={t('JOIN_LOBBY')} onPress={onJoinLobby} />
            </View>
        </MainView>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
    },
    title: {
        fontSize: FontSize.title,
        textAlign: 'center',
        marginTop: '10%',
    },
    subTitle: {
        fontSize: FontSize.subTitle,
        textAlign: 'center',
    },
    buttonContainer: {
        marginBottom: '10%',
    },
});

export default LobbyInsertCode;