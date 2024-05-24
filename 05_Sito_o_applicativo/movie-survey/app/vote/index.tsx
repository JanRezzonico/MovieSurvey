import React, { useEffect, useRef, useState } from "react";
import { View, Pressable, StyleSheet, Dimensions, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams } from "expo-router";

import MainView from "../(components)/MainView";
import SText from "../(components)/SText";
import SModal from "../(components)/SModal";
import socket from "../../socket";
import { getRoomCode } from "../../storage/roomCode";
import Colors from "../../constants/Colors";

import Card from "./(components)/Card";
import CardButton from "./(components)/CardButton";
import FontSize from "../../constants/FontSize";
import RoomCode from "../(components)/RoomCode";

type SearchParamType = {
    external_id: string;
    title: string;
    cover: string;
    year: string;
    genres: string;
    description: string;
}

interface MovieObject {
    movie: Movie;
}

interface Movie {
    external_id: number;
    title: string;
    cover: string;
    year: string;
    genres: string[];
    description: string;
}

const VotePage = () => {
    const { t } = useTranslation();
    const screenWidth = Dimensions.get('screen').width;
    const cardRef = useRef() as any;
    const [showDescriptionModal, setShowDescriptionModal] = useState<boolean>(false);
    const [trimmedDescription, setTrimmedDescription] = useState<string>("");
    const params = useLocalSearchParams<SearchParamType>();
    const [movieCount, setMovieCount] = useState<number>(1);
    const [canSwipe, setCanSwipe] = useState<boolean>(true);
    const [currentMovie, setCurrentMovie] = useState<Movie>({
        external_id: parseInt(params.external_id),
        title: params.title,
        cover: params.cover,
        year: params.year,
        genres: params.genres ? params.genres.split(",") : [],
        description: params.description
    });
    const [nextMovie, setNextMovie] = useState<Movie>();

    useEffect(() => {
        const handleNextMovie = (object: MovieObject | undefined) => {
            if (!object) {
                setCurrentMovie(nextMovie);
                return;
            }
            const { movie } = object;
            if (movieCount === 1) {
                setNextMovie(movie);
                setMovieCount(movieCount + 1);
                return;
            }
            setCurrentMovie(nextMovie);
            setNextMovie(movie);
        };

        socket.on('vote:next', handleNextMovie);
        return () => {
            socket.off('vote:next', handleNextMovie);
        };
    }, [movieCount, currentMovie, nextMovie]);

    useEffect(() => {
        const slicedDescription = currentMovie.description.split(' ').slice(0, 15);
        setTrimmedDescription(slicedDescription.join(' ') + (slicedDescription.length < currentMovie.description.split(' ').length ? '... read more' : ''));
    }, [currentMovie]);

    useEffect(() => {
        if (nextMovie) {
            Image.prefetch(nextMovie.cover);
        }
    }, [nextMovie]);

    const onSwipe = (direction: string) => {
        setCanSwipe(false);
        socket.emit('vote:vote', { roomCode: getRoomCode(), movieId: currentMovie.external_id, vote: direction === 'right' });
        setTimeout(() => { setCanSwipe(true) }, 500);
    };

    const swipe = async (direction: string) => {
        await cardRef.current.swipe(direction);
    };

    return (
        <MainView style={styles.mainView}>
            <RoomCode />
            <Card
                cardRef={cardRef}
                movie={currentMovie}
                trimmedDescription={trimmedDescription}
                onSwipe={onSwipe}
                setShowDescriptionModal={setShowDescriptionModal}
            />
            <View style={[styles.buttonsContainer, { width: screenWidth }]}>
                <CardButton onPress={() => swipe('left')} direction="left" />
                <SText style={styles.swipeInstructions}>{t('SWIPE_INSTRUCTIONS')}</SText>
                <CardButton onPress={() => swipe('right')} direction="right" />
            </View>
            <SModal show={showDescriptionModal} setShow={setShowDescriptionModal}>
                <SText>{currentMovie.description}</SText>
            </SModal>
        </MainView>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignSelf: 'center',
        paddingHorizontal: '5%',
        paddingVertical: '2%',
        position: 'absolute',
        bottom: 10,
        alignItems: 'center',
    },
    swipeInstructions: {
        marginHorizontal: 10,
        width: '40%'
    }
});

export default VotePage;
