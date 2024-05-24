import { TextInput, TextInputProps, View } from "react-native";
import Colors from "../../constants/Colors";
import SText from "./SText";
import { useEffect, useState } from "react";
import FontSize from "../../constants/FontSize";

const STextInput = (props: TextInputProps) => {
    const [charsLeft, setCharsLeft] = useState<number>(props.maxLength);
    const [countChars, setCountChars] = useState<boolean>(!!props.maxLength);
    const onChangeText = (text: string) => {
        if (countChars) {
            setCharsLeft(props.maxLength - text.length);
        }
        if (props.onChangeText) {
            props.onChangeText(text);
        }
    }
    useEffect(() => {
        setCountChars(!!props.maxLength);
    }, [props]);
    useEffect(() => {
        if (countChars) {
            setCharsLeft(props.maxLength - (props.value || "").length);
        }
    }, []);
    return (
        <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', margin: 10 }}>
            <TextInput style={{ fontFamily: 'Poppins', color: Colors.text, fontSize: FontSize.normal, width: '80%', borderColor: Colors.text, borderBottomWidth: 1 }} {...props} onChangeText={onChangeText} />
            {countChars && <SText>{charsLeft}</SText>}
        </View>
    );
};

export default STextInput;