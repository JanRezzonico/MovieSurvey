import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = 'username';

const getUsername = async () => {
    try {
        return await AsyncStorage.getItem(KEY);
    } catch (e) {
        console.error(e);
        return null;
    }
}

const setUsername = async (username: string) => {
    try {
        await AsyncStorage.setItem(KEY, username);
    } catch (e) {
        console.error(e);
    }
}

export { getUsername, setUsername };