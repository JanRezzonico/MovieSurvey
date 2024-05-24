import { Text, View, StyleSheet, Modal, TextInput, Image, Dimensions } from "react-native";
import MainView from "../(components)/MainView";
import SText from "../(components)/SText";
import FontSize from "../../constants/FontSize";
import { useTranslation } from "react-i18next";
import Button from "../(components)/Button";
import { useState } from "react";
import InsertNameModal from "./InsertNameModal";

const HomePage = () => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [username, setUsername] = useState('');
    const [isCreate, setIsCreate] = useState(false);
    const screenWidth = Dimensions.get('screen').width;
    const openCreateLobby = () => {
        setIsCreate(true);
        setShowModal(true);
    }
    const openJoinLobby = () => {
        setIsCreate(false);
        setShowModal(true);
    }
    return (
        <>
            <MainView useScrollView={false} style={styles.mainView}>
                <SText style={styles.title}>{t('APP_TITLE')}</SText>
                <Image source={require('../../assets/icon.png')} style={{width: screenWidth * 0.8, height: screenWidth * 0.8, alignSelf: 'center'}} />
                <View style={styles.buttonContainer}>
                    <Button text={t('CREATE_LOBBY')} onPress={openCreateLobby} />
                    <Button type="secondary" text={t('JOIN_LOBBY')} onPress={openJoinLobby} />
                </View>
            </MainView>
            <InsertNameModal show={showModal} setShow={setShowModal} isCreate={isCreate} username={username} setUsername={setUsername} />
        </>
    );
};

export default HomePage;

const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: FontSize.title,
        textAlign: 'center',
        paddingTop: '10%'
    },
    buttonContainer: {
        paddingBottom: '15%'
    }
});