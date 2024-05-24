import { StyleSheet, View, ViewStyle, SafeAreaView, ScrollView } from "react-native";
import React, { ReactNode } from "react";
import Colors from "../../constants/Colors";

interface MainViewProps {
    children?: ReactNode;
    style?: ViewStyle;
    useScrollView?: boolean;
}

const MainView = ({ children, style, useScrollView = false }: MainViewProps) => {
    return (
        <SafeAreaView style={[styles.MainView, style ?? {}]}>
            {
                !useScrollView && children
            }
            {
                useScrollView &&
                <ScrollView>
                    <View style={[styles.MainView, style ?? {}]}>
                        {children}
                    </View>
                </ScrollView>
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    MainView: {
        flex: 1,
        padding: 10,
        backgroundColor: Colors.background
    }
});


export default MainView;