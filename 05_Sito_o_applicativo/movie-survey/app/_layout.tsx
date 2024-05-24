import { Stack, router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import * as ScreenOrientation from 'expo-screen-orientation';
import Colors from "../constants/Colors";
import Toast from 'react-native-toast-message';
import { Poppins_400Regular as Poppins } from "@expo-google-fonts/poppins"
import { FiraMono_400Regular as FiraMono } from "@expo-google-fonts/fira-mono"
import * as Font from "expo-font";
import i18n from "../language/i18n.config";
import { useTranslation } from "react-i18next";
import LoadingIndicator from "./(components)/LoadingIndicator";
import socket from "../socket";
const RootLayout = () => {
    const a = i18n.isInitialized; // KEEP THIS LINE. It is used to trigger the i18n initialization
    const { t } = useTranslation(); // KEEP THIS LINE. It is used to trigger the i18n initialization
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const navigation = useNavigation();
    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            console.log("Preventing back")
            e.preventDefault(); // Prevent going back
        });
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        const loadFonts = async () => {
            await Font.loadAsync({
                Poppins,
                FiraMono
            });
            setFontsLoaded(true);
        }
        loadFonts();
        return () => {
            // On app close
            navigation.removeListener('beforeRemove', () => { });
            socket.disconnect();
        }
    }, []);
    if (!fontsLoaded) {
        return <LoadingIndicator />
    }


    return (
        <>
            <Stack screenOptions={{
                headerShown: false,
                statusBarColor: Colors.background
            }}>
            </Stack>
            {
                <Toast />
            }
        </>
    );
};

export default RootLayout;