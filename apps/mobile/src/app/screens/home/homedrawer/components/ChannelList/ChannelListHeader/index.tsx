import { AngleRightIcon, CircleIcon, VerifyIcon } from "@mezon/mobile-components";
import { Text, TouchableOpacity, View } from "react-native";
import { ClansEntity } from "@mezon/store-mobile";
import styles from "./style";
import { Colors } from "@mezon/mobile-ui";
interface IProps {
    onPress: () => void;
    clan: ClansEntity;
}

export default function ChannelListHeader({ onPress, clan }: IProps) {
    function handlePress() {
        onPress && onPress();
    }

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <View style={styles.listHeader} >
                <View style={styles.titleNameWrapper}>
                    <Text style={styles.titleServer}>{clan?.clan_name}</Text>
                    <VerifyIcon width={18} height={18} />
                </View>
                <AngleRightIcon height={18} width={18} />
            </View>
            <View style={styles.infoHeader}>
                <Text style={styles.textInfo}>398 Members</Text>
                <CircleIcon width={5} height={5} color={Colors.gray48} />
                <Text style={styles.textInfo}>Community</Text>
            </View>
        </TouchableOpacity>
    )
}