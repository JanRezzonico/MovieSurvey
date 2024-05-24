import { Platform, Pressable, TextInput, View, StyleSheet } from "react-native";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
import SText from "./SText";
import React, { useEffect, useState } from "react";

interface Props {
    code?: string;
    setCode?: (code: string) => void;
    enabled?: boolean;
}
const CodeInput = ({ code = "", setCode = (c: string) => { code = c }, enabled = true }: Props) => {
    const LENGTH = 4;
    const [filledCode, setFilledCode] = useState(code.padEnd(LENGTH, " "));
    const inputRef = React.useRef() as React.MutableRefObject<TextInput>;
    const onChangeText = (text: string) => {
        if (!enabled) return;
        text = text.toUpperCase();
        //Keep only letters and numbers, removing any other character (including whitespace)
        text = text.replace(/[^A-Z0-9]/g, '');
        if (text.length > LENGTH) text = text.slice(0, LENGTH);
        setCode(text);
    }
    useEffect(() => {
        setFilledCode(code.padEnd(LENGTH, " "));
    }, [code]);

    //Autofocus was tried with both useEffect and the native autoFocus prop, but neither worked for android (ios works fine)

    if (Platform.OS === 'web') return (
        <TextInput
            keyboardType="ascii-capable"
            autoCapitalize="characters"
            maxLength={LENGTH}
            value={code}
            onChangeText={onChangeText}
            style={styles.webTextInput}
            ref={inputRef}
        />
    )
    return (
        <>
            <TextInput
                keyboardType="ascii-capable"
                autoCapitalize="characters"
                maxLength={LENGTH}
                value={code}
                onChangeText={onChangeText}
                style={[styles.textInput, {
                    // display: Platform.OS === 'ios' ? 'none' : 'flex', // Display none breaks the input on Android
                }]}
                cursorColor={Colors.transparent}
                ref={inputRef}
            />
            <Pressable onPress={() => { inputRef.current.focus() }} disabled={!enabled}>
                <View style={styles.codeView}>
                    {
                        filledCode.split("").map((c, i) => {
                            return (
                                <View key={c + i}>
                                    <SText style={styles.codeChar}>{c}</SText>
                                    <View style={styles.dash} />
                                </View>
                            )
                        })
                    }
                </View>
            </Pressable>
        </>
    );
};

const styles = StyleSheet.create({
    dash: {
        borderColor: Colors.primary,
        borderWidth: 2
    },
    codeChar: {
        fontSize: FontSize.title * 2,
        textAlign: 'center',
        color: Colors.text,
        fontFamily: 'FiraMono'
    },
    codeView: {
        margin: '10%',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10
    },
    textInput: {
        position: 'absolute',
        top: -100, //Position the input off screen to avoid accidental focus}
    },
    webTextInput: {
        fontSize: FontSize.title * 2,
        textAlign: 'center',
        color: Colors.text,
        fontFamily: 'FiraMono',
        borderColor: Colors.primary,
        borderBottomWidth: 2,
        width: '50%',
        alignSelf: 'center',
        marginTop: '10%'
    }
});

export default CodeInput;