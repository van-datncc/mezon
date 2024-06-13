import { AngleRightIcon, CircleIcon, VerifyIcon } from "@mezon/mobile-components";
import { Text, TouchableOpacity, View } from "react-native";
import { ClansEntity } from "@mezon/store-mobile";
import styles from "./style";
import { Colors } from "@mezon/mobile-ui";
import FastImage from "react-native-fast-image";
interface IProps {
    onPress: () => void;
    clan: ClansEntity;
}

export default function ChannelListHeader({ onPress, clan }: IProps) {
    function handlePress() {
        onPress && onPress();
    }

    return (
        <View style={styles.container}>
            <FastImage
                source={{ uri: clan?.banner }}
                style={{ flex: 1 }}
                resizeMode="cover"
            />

            <View style={styles.listHeader}>
                <View style={styles.titleNameWrapper}>
                    <Text style={styles.titleServer}>{clan?.clan_name}</Text>
                    <VerifyIcon width={18} height={18} />
                </View>

                <TouchableOpacity style={styles.actions} onPress={handlePress}>
                    <AngleRightIcon height={18} width={18} color="white"/>
                </TouchableOpacity>
            </View>
        </View>
    )
}