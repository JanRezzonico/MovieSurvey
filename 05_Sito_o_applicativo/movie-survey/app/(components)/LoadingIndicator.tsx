import { ActivityIndicator } from "react-native";
import MainView from "./MainView";
import Colors from "../../constants/Colors";

const LoadingIndicator = () => {
    return (
        <MainView style={{ justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={"large"} color={Colors.primary} />
        </MainView>
    );
};

export default LoadingIndicator;