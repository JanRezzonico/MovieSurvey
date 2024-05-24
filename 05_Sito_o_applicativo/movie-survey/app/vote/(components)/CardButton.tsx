import { FontAwesome } from "@expo/vector-icons";
import { Animated, Dimensions, Pressable } from "react-native";
import Colors from "../../../constants/Colors";
interface Props {
    onPress: () => void;
    direction: 'left' | 'right';
}
const CardButton = ({ onPress, direction }: Props) => {
    const screenWidth = Dimensions.get('screen').width;
    const animated = new Animated.Value(1);
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
        <Pressable
            onPress={onPress}
            onPressIn={fadeIn}
            onPressOut={fadeOut}
            style={{
                backgroundColor: direction === 'left' ? Colors.red : Colors.green,
                width: screenWidth * 0.2,
                aspectRatio: 1,
                borderRadius: 10000,// % is not supported, so we use a big number to make sure it's a circle
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            <Animated.View style={{ opacity: animated }}>
                <FontAwesome name={direction === 'left' ? "times" : "heart"} size={screenWidth * 0.1} color="white" />
            </Animated.View>
        </Pressable>
    );
};

export default CardButton;