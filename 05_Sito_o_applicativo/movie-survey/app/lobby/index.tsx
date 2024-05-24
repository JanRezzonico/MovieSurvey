import { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Dimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { router, useLocalSearchParams } from "expo-router";
import MainView from "../(components)/MainView";
import SText from "../(components)/SText";
import CodeInput from "../(components)/CodeInput";
import Button from "../(components)/Button";
import socket from "../../socket";
import Colors from "../../constants/Colors";
import FontSize from "../../constants/FontSize";
import { isAdmin } from "../../storage/isAdmin";
import LoadingIndicator from "../(components)/LoadingIndicator";

type SearchParamType = {
    admin: string;
    code: string;
    users: string;
};

const Lobby = () => {
    const { t } = useTranslation();
    const params = useLocalSearchParams<SearchParamType>();
    const [users, setUsers] = useState<string[]>([]);
    const [admin, setAdmin] = useState<boolean>(false);
    const [code, setCode] = useState<string>("");
    const [showLoading, setShowLoading] = useState<boolean>(false);

    const onStart = () => {
        setShowLoading(true);
        socket.emit('lobby:start');
    }

    const onPickMovieLists = () => {
        router.push('/lobby/movie-lists');
    }

    useEffect(() => {
        const handleUpdate = ({ users }: { users: string[] }) => {
            setUsers(users);
        };

        setAdmin(params.admin === 'true');
        setCode(params.code);
        setUsers(params.users.split(","));

        socket.on('lobby:update', handleUpdate);

        return () => {
            socket.off('lobby:update', handleUpdate);
        };
    }, [params.admin, params.code, params.users]);
    if (showLoading) {
        return <LoadingIndicator />;
    }
    const screenWidth = Dimensions.get('screen').width;
    const bigScreen = screenWidth > 600;
    return (
        <MainView>
            <SText style={styles.title}>{t('SHARE_CODE')}</SText>
            <CodeInput code={code} enabled={false} />
            <ScrollView>
                <View style={styles.userContainer}>
                    {users.map((user, index) => (
                        <View key={index} style={[styles.userItem, {width: bigScreen ? '40%' : '80%'}]}>
                            <SText numberOfLines={1}>{user}</SText>
                        </View>
                    ))}
                </View>
            </ScrollView>
            {admin && (
                <View style={styles.adminButtons}>
                    <Button text={t('PICK_MOVIE_LISTS')} onPress={onPickMovieLists} type="secondary" />
                    <Button enabled={users.length > 1} text={t('START')} onPress={onStart} />
                </View>
            )}
        </MainView>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: FontSize.title,
        textAlign: 'center',
        marginTop: '10%',
    },
    userContainer: {
        flexDirection: "row",
        flexWrap: 'wrap',
        marginHorizontal: '10%',
        justifyContent: 'space-evenly'
    },
    userItem: {
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        padding: 10,
        margin: 10,
    },
    adminButtons: {
        marginBottom: '10%',
    },
});

export default Lobby;