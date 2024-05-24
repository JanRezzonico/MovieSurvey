import { useState } from "react";
import { useWindowDimensions, Pressable, View } from "react-native";
import SText from "../../(components)/SText";
import socket from "../../../socket";
import Colors from "../../../constants/Colors";

const ListComponent = ({ list }) => {
    const [selected, setSelected] = useState(list.status);
    const dimensions = useWindowDimensions();
    const size = dimensions.width * 0.35;
    const onPress = () => {
        setSelected(!selected);
        //!selected is true if it is now selected, since the state is not updated yet but will only on the next render
        socket.emit('lobby:updateList', { id: list.id, status: !selected })
    }
    return (
        <Pressable onPress={onPress}>
            <View style={{ width: size, height: size, padding: 5, borderRadius: 5, backgroundColor: selected ? Colors.primary : Colors.light, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10 }}>
                <SText style={{ textAlign: 'center', color: selected ? Colors.text : Colors.textNegative }}>{list.name}</SText>
            </View>
        </Pressable>
    );
}

export default ListComponent;