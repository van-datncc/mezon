import { LayoutAnimation, Pressable, Text, View } from "react-native";
import styles from "./style"
import MemberListStatus from "../../MemberStatus";
import { useState } from "react";

const TabList = [
    { name: "Members" },
    { name: "Media" },
    { name: "Pins" },
    { name: "Links" },
    { name: "Files" }
]

interface IProps {
    activeId: number;
}

interface IPos {
    x: number;
    y: number;
    width: number;
    height: number;
}

export default function AssetsViewer({ activeId }: IProps) {
    const [pos, setPos] = useState<IPos[]>([]);
    const [selected, setSelected] = useState<number>(activeId);

    function handleKLayout(event, index: number) {
        const { x, y, width, height } = event.nativeEvent.layout;
        const tmp = pos;
        tmp[index] = { x, y, width, height };
        setPos(tmp);
    }

    function handlePress(event, index: number) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        setSelected(index);
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerTab}>
                {TabList.map((tab, index) => (
                    <Pressable
                        key={index.toString()}
                        onLayout={(e) => handleKLayout(e, index)}
                        onPress={(e) => handlePress(e, index)}
                    >
                        <Text style={{ color: index === selected ? "purple" : "white" }}>
                            {tab.name}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {pos.length > selected && (
                <View style={styles.a}>
                    <View style={{
                        ...styles.b,
                        width: pos[selected].width || 0,
                        left: pos[selected].x || 0,
                    }}>
                    </View>
                </View>
            )}

            <MemberListStatus />
        </View >
    )
}