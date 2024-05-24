import { router } from "expo-router";
import Toast from "react-native-toast-message";

const vote = {
    start: ({ movie }) => {
        router.replace({ pathname: '/vote', params: { ...movie } });
    },
    // vote:next is handled directly in the component (app/vote/index.tsx)
    error: ({ message }) => {
        Toast.show({
            type: 'error',
            text1: message,
            position: 'bottom'
        });
    },
    scoreboard: ({ scoreboard }) => {
        router.replace({ pathname: '/lobby/scoreboard', params: { value: JSON.stringify(scoreboard) } });
    },
    completed: () => {
        router.replace('/lobby/waiting-area');
    }
}

export default vote;