import React from "react";
import { View, StyleSheet } from "react-native";
import MainView from "../(components)/MainView";
import SText from "../(components)/SText";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
import { useTranslation } from "react-i18next";
import RoomCode from "../(components)/RoomCode";

const WaitingArea = () => {
    const { t } = useTranslation();
    return (
        <MainView style={styles.container}>
            <RoomCode />
            <SText style={styles.title}>{t('WAITING_FOR_OTHERS')}</SText>
            <View style={styles.contentContainer}>
                <SText style={styles.description}>{t('WAITING_FOR_OTHERS_DESCRIPTION')}</SText>
            </View>
        </MainView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: FontSize.title,
        marginBottom: 20,
        marginTop: '10%'
    },
    description: {
        fontSize: FontSize.normal,
        textAlign: "center",
    },
    contentContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    }
});

export default WaitingArea;