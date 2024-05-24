import { useTranslation } from "react-i18next";
import MainView from "../(components)/MainView";
import SText from "../(components)/SText";
import { useLocalSearchParams } from "expo-router";
import { Dimensions, ScrollView, View, StyleSheet, Pressable } from "react-native";
import Colors from "../../constants/Colors";
import FontSize from "../../constants/FontSize";
import Button from "../(components)/Button";
import socket from "../../socket";
import { isAdmin } from "../../storage/isAdmin";
import { useState } from "react";
import SModal from "../(components)/SModal";
import * as Linking from 'expo-linking';
import { Toast } from "react-native-toast-message/lib/src/Toast";
import RoomCode from "../(components)/RoomCode";

type SearchParamType = { value: string };

interface ScoreboardField {
    score: string;
    external_id: number;
    title: string;
    year: string;
    genres: string[];
}

const ScoreboardPage = () => {
    const { t } = useTranslation();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedMovie, setSelectedMovie] = useState<ScoreboardField | null>(null);
    const params = useLocalSearchParams<SearchParamType>();
    const scoreboard: Array<ScoreboardField> = JSON.parse(params.value);
    const screenWidth = Dimensions.get('screen').width;
    const bigScreen = screenWidth > 600;
    const width = bigScreen ? screenWidth * 0.1 : screenWidth * 0.175;
    const onDone = () => {
        socket.emit('lobby:quit'); //Admin quitting destroys the room
    }
    const onNewIteration = () => {
        socket.emit('lobby:startNewIteration');
    }
    const viewTrailer = () => {
        socket.emit('movie:trailer', selectedMovie.external_id, (url) => {
            if (url) {
                Linking.openURL(url)
            } else {
                Toast.show({
                    type: 'error',
                    text1: t('TRAILER_NOT_FOUND'),
                    position: 'bottom'
                });
            }
        })
    }
    return (
        <>
            <MainView>
                <RoomCode />
                <SText style={styles.title}>{t('SCOREBOARD')}</SText>
                <ScrollView>
                    {
                        scoreboard.map((field) => {
                            return (
                                <Pressable key={field.external_id} onPress={() => { setModalOpen(true); setSelectedMovie(field); }}>
                                    <View style={styles.item}>
                                        <View style={[styles.scoreView, { width: width }]}>
                                            <SText style={styles.scoreText}>{field.score}</SText>
                                        </View>
                                        <View style={[styles.infoView, { height: width }]}>
                                            <SText style={styles.movieTitle} ellipsizeMode="tail" numberOfLines={1}>{field.title}</SText>
                                            <SText style={styles.movieInfo} ellipsizeMode="tail" numberOfLines={1}>{field.year}</SText>
                                            <SText style={styles.movieInfo} ellipsizeMode="tail" numberOfLines={1}>{field.genres.join(', ')}</SText>
                                        </View>
                                    </View>
                                </Pressable>
                            );
                        })
                    }
                </ScrollView>
                {
                    isAdmin() && <View style={styles.adminButtons}>
                        <Button text={t('DONE')} onPress={onDone} />
                        <Button type="secondary" text={t('NEW_ITERATION')} onPress={onNewIteration} />
                    </View>
                }

            </MainView>
            <SModal show={modalOpen} setShow={setModalOpen} light={true}>
                <SText style={styles.modalText}>{selectedMovie?.title}</SText>
                <Button text={t('VIEW_TRAILER')} onPress={viewTrailer} />
            </SModal>
        </>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: FontSize.title,
        textAlign: 'center',
        margin: '5%'
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: '5%'
    },
    scoreView: {
        backgroundColor: Colors.secondary,
        aspectRatio: 1,
        margin: 10,
        borderRadius: 10,
        justifyContent: 'center'
    },
    scoreText: {
        textAlign: 'center'
    },
    infoView: {
        backgroundColor: Colors.secondary,
        flex: 1,
        justifyContent: 'space-evenly',
        padding: 10,
        borderRadius: 10,
        margin: 10,
    },
    movieTitle: {
        fontSize: FontSize.normal
    },
    movieInfo: {
        alignSelf: 'flex-end',
        fontSize: FontSize.small
    },
    adminButtons: {
        marginVertical: '4%'
    },
    modalText: {
        color: Colors.textNegative
    }
});

export default ScoreboardPage;