import React, { useEffect, useState } from "react";
import { ImageBackground, Pressable, View, Image, Dimensions, StyleSheet } from "react-native";
import TinderCard from 'react-tinder-card';
import Colors from "../../../constants/Colors";
import FontSize from "../../../constants/FontSize";
import SText from "../../(components)/SText";
import LoadingIndicator from "../../(components)/LoadingIndicator";

interface CardProps {
    movie: Movie;
    trimmedDescription: string;
    onSwipe: (direction: string) => void;
    setShowDescriptionModal: (show: boolean) => void;
    cardRef: React.Ref<any>;
}

interface Movie {
    external_id: number;
    title: string;
    cover: string;
    year: string;
    genres: string[];
    description: string;
}

const Card = ({ movie, trimmedDescription, onSwipe, setShowDescriptionModal, cardRef }: CardProps) => {
    const screenWidth = Dimensions.get('screen').width;
    const [imageLoading, setImageLoading] = useState(true);
    const styles = StyleSheet.create({
        imageBackground: {
            width: screenWidth * 0.95,
            alignSelf: 'center',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            borderRadius: 10
        },
        cardContent: {
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginTop: 20,
            alignSelf: 'center',
            backgroundColor: Colors.primaryTransparent,
            borderRadius: 10,
            margin: 10,
            padding: 10,
            width: '85%'
        },
        title: {
            fontSize: FontSize.subTitle
        },
        description: {
            fontSize: FontSize.small
        }
    });
    useEffect(() => {
        setImageLoading(true);
    }, [movie]);
    return (
        <TinderCard ref={cardRef} key={movie.external_id} onSwipe={onSwipe} preventSwipe={['up', 'down']} flickOnSwipe={true}>
            <ImageBackground
                source={{ uri: movie.cover }}
                style={styles.imageBackground}
                resizeMode="contain"
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(true)}
            >
                <View style={styles.cardContent}>
                    <SText style={styles.title}>{movie.title} ({movie.year})</SText>
                    <SText>{movie.genres.join(", ")}</SText>
                    <Pressable onPress={() => setShowDescriptionModal(true)}>
                        <SText style={styles.description}>{trimmedDescription}</SText>
                    </Pressable>
                </View>
                {imageLoading && <LoadingIndicator />}
            </ImageBackground>
        </TinderCard>
    );
}

export default Card;
