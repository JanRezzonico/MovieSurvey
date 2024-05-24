import { Modal, Pressable, TouchableWithoutFeedback, View, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

interface Props {
    show: boolean;
    setShow: (show: boolean) => void;
    children?: React.ReactNode;
    light?: boolean;
}

const SModal = ({ show, setShow, children, light = false }: Props) => {
    return (
        <Modal
            animationType='fade'
            visible={show}
            transparent={true}
            onRequestClose={() => {
                setShow(false);
            }}>
            <Pressable style={{ width: '100%', height: '100%' }} onPressOut={() => { setShow(false) }}>
                <TouchableWithoutFeedback>
                    <View style={[styles.mainView, { backgroundColor: light ? Colors.light : Colors.secondary }]}>
                        {children}
                    </View>
                </TouchableWithoutFeedback>
            </Pressable>
        </Modal >
    );

};

const styles = StyleSheet.create({
    mainView: {
        alignContent: 'center',
        justifyContent: 'center',
        width: '80%',
        backgroundColor: Colors.secondary,
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 'auto',
        marginBottom: 'auto'
    }
});


export default SModal;