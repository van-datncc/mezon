import { Text, View } from "react-native";
import { MezonButton } from "../MezonButton";
import styles from "./styles";

export interface IMezonMenuItemProps {
    title: string,
    icon?: any,
    onPress?: () => void,
    expandable?: boolean,
    isLast?: boolean
}
export default function MezonMenuItem({ isLast: lastItem, title, expandable, icon, onPress }: IMezonMenuItemProps) {
    return (
        <MezonButton
            onPress={() => onPress()}
            viewContainerStyle={styles.btn}>
            {icon}
            <View style={[styles.btnTitleWrapper, !lastItem && styles.borderBottom]}>
                <Text style={styles.btnTitle}>{title}</Text>
            </View>
        </MezonButton>
    )
}