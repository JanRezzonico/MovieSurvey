import Toast from "react-native-toast-message";
import i18n from "../../language/i18n.config";
import { router } from "expo-router";

let wasDisconnected = false;

const connection = {
    connectError: () => {
        wasDisconnected = true;
        Toast.show({
            type: 'error',
            text1: i18n.t('CONNECTION_ERROR'),
            position: 'bottom',
            autoHide: false
        });
        router.navigate('/home');
    },
    connect: () => {
        if (wasDisconnected) {
            Toast.show({
                type: 'success',
                text1: i18n.t('RECONNECTED'),
                position: 'bottom',
                autoHide: true
            });
            wasDisconnected = false;
        }
    }
};

export default connection;