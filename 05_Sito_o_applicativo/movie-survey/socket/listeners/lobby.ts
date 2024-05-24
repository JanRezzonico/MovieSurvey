import { router } from "expo-router";
import socket from "..";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { deleteRoomCode, setRoomCode } from "../../storage/roomCode";
import { resetAdmin, setAdmin } from "../../storage/isAdmin";
import i18n from "../../language/i18n.config";
import { getUserDifference } from "../../storage/users";
import { deleteUsers } from "../../storage/users";

const lobby = {
    joined: ({ admin, users, code }) => {
        router.replace({ pathname: '/lobby', params: { admin: String(admin), users: users, code } });
        setRoomCode(code);
        setAdmin(admin);
    },
    update: ({ users }) => {
        const difference = getUserDifference(users);
        if (!difference) return; //Avoid showing a toast with faulty data
        Toast.show({
            type: 'info',
            text1: `${difference.username} ${difference.joined ? i18n.t('JOINED') : i18n.t('LEFT')}`,
            position: 'bottom'
        });

    },
    destroyed: () => {
        deleteRoomCode();
        resetAdmin();
        deleteUsers();
        router.replace('/home');
        Toast.show({
            type: 'info',
            text1: i18n.t('ROOM_DESTROYED'),
            position: 'bottom'
        });
    },
    error: ({ message }) => {
        Toast.show({
            type: 'error',
            text1: message,
            position: 'bottom'
        });
    }
}
export default lobby;