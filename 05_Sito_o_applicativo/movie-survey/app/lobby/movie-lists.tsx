import { useState, useEffect } from "react";
import { FlatList, Pressable, ScrollView, View, useWindowDimensions, StyleSheet } from "react-native";
import MainView from "../(components)/MainView";
import socket from "../../socket";
import SText from "../(components)/SText";
import Colors from "../../constants/Colors";
import FontSize from "../../constants/FontSize";
import { useTranslation } from "react-i18next";
import Button from "../(components)/Button";
import { router } from "expo-router";
import ListComponent from "./(components)/ListComponents";

interface ListItem {
    name: string;
    id: string; //ObjectId
    status: boolean;
}

const MovieLists = () => {
    const { t } = useTranslation();
    const [lists, setLists] = useState<Array<ListItem>>([]);
    useEffect(() => {
        socket.emit('lobby:fetchLists', (lists: Array<ListItem>) => { setLists(lists) });
    }, [])
    return (
        <MainView >
            <SText style={styles.title}>{t('SELECT_MOVIE_LISTS')}</SText>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {lists.map((list) => <ListComponent key={list.id} list={list} />)}
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button text={t('DONE')} onPress={router.back} />
            </View>
        </MainView>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: FontSize.title,
        textAlign: 'center',
        marginTop: '10%',
    },
    scrollView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        marginTop: '5%',
    },
    buttonContainer: {
        marginBottom: '10%',
    },
});

export default MovieLists;
