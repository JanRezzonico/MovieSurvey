import { Pressable, Text, StyleSheet, Animated } from "react-native";
import Colors from "../../constants/Colors";
import SText from "./SText";
import { useEffect, useState } from "react";

interface Props {
    type?: 'primary' | 'secondary' | 'other';
    text?: string;
    color?: string;
    onPress?: () => void;
    enabled?: boolean;
}
const colorMap = {
    primary: Colors.primary,
    secondary: Colors.secondary,
    other: Colors.light
}
// https://stackoverflow.com/questions/68413202/react-native-how-to-add-opacity-feedback-to-pressable-component
const Button = ({ type = 'primary', text = '', color, onPress, enabled = true }: Props) => {
    const [buttonColor, setButtonColor] = useState(color || colorMap[type]);
    const animated = new Animated.Value(1);

    useEffect(() => {
        setButtonColor(enabled ? color || colorMap[type] : Colors.light);
    }, [enabled, color]);

    const fadeIn = () => {
        Animated.timing(animated, {
            toValue: 0.1,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    const fadeOut = () => {
        Animated.timing(animated, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Pressable style={[styles.button, { backgroundColor: buttonColor }]} onPressIn={fadeIn} onPressOut={fadeOut} onPress={onPress} disabled={!enabled}>
            <Animated.View style={{ opacity: animated }}>
                <SText style={styles.text}>{text}</SText>
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        margin: 10,
        borderRadius: 5,
        width: '80%',
        alignSelf: 'center'
    },
    text: {
        color: 'white',
        textAlign: 'center'
    }
});

export default Button;