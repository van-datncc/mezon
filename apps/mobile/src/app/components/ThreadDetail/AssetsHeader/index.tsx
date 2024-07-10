import { useState } from "react";
import { GestureResponderEvent, LayoutChangeEvent, Pressable, View } from "react-native";
import { Text } from 'react-native';
import styles from "./style";
import { useEffect } from "react";
import { useCallback } from "react";
import { Colors } from "@mezon/mobile-ui";

interface IPos {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface IProps {
    pageID: number;
    onChange?: (pageID: number) => void;
    titles: string[];
}

const usePos = (): [IPos[], ((event: LayoutChangeEvent, index: number) => void)] => {
    const [pos, setPos] = useState<IPos[]>([]);

    const onLayout = useCallback((event: LayoutChangeEvent, index: number) => {
        const { width, height, x, y } = event.nativeEvent.layout;
        setPos((p) => {
            const tmp = p.slice();
            tmp[index] = { x, y, width, height };
            return tmp
        });
    }, []);

    return [pos, onLayout];
};

export default function AssetsHeader({ pageID = 0, onChange, titles = [] }: IProps) {
    const [pos, onLayout] = usePos();
    const [selected, setSelected] = useState<number>(pageID);

    useEffect(() => {
        setSelected(pageID);
    }, [pageID])

    function handlePress(event: GestureResponderEvent, index: number) {
        onChange && onChange(index);
    }

    return (
        <>
            <View style={styles.headerTab}>
                {titles.map((title, index) => (
                    <Pressable
                        key={index.toString()}
                        onLayout={(e) => onLayout(e, index)}
                        onPress={(e) => handlePress(e, index)}
                    >
                        <Text style={{ color: index === selected ? Colors.textViolet : Colors.white }}>
                            {title}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {pos?.length > selected && (
                <View style={styles.a}>
                    <View style={{
                        ...styles.b,
                        width: pos[selected].width || 0,
                        left: pos[selected].x || 0,
                    }}>
                    </View>
                </View>
            )}
        </>
    )
}
