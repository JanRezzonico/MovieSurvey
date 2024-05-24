import { useTranslation } from "react-i18next";
import SModal from "../(components)/SModal";
import { View } from "react-native";
import FontSize from "../../constants/FontSize";
import SText from "../(components)/SText";
import STextInput from "../(components)/STextInput";
import Button from "../(components)/Button";
import socket from "../../socket";
import { router } from "expo-router";
import { useEffect } from "react";
import { getUsername, setUsername as setUsernameInStorage } from "../../storage/username";

interface Props {
    show: boolean;
    setShow: (show: boolean) => void;
    isCreate: boolean;
    username: string;
    setUsername: (username: string) => void;
}

const InsertNameModal = ({ show, setShow, isCreate, username, setUsername } : Props) => {
    const { t } = useTranslation();
    const onChangeText = (text: string) => {
        setUsername(text);
    }
    const create = () => {
        setUsernameInStorage(username);
        socket.emit('lobby:create', { username });
        setShow(false);
    }
    const join = () => {
        setUsernameInStorage(username);
        router.push(`/lobby/join/${username}`);
        setShow(false);
    }
    useEffect(() => {
        getUsername().then((username)=>{if(username) setUsername(username)});
    }, []);
    return (
        <SModal show={show} setShow={setShow}>
            <View>
                <SText style={{ textAlign: "center", fontSize: FontSize.subTitle }}>{t('INSERT_NAME')}</SText>
                <STextInput maxLength={20} textContentType="givenName" autoComplete="given-name" value={username} onChangeText={onChangeText} />
                <Button text={t('GO')} onPress={isCreate ? create : join} enabled={username.length > 0} />
            </View>
        </SModal>
    );
}

export default InsertNameModal;