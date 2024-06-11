import { Text, View } from "react-native";
import { MezonButton } from "../MezonButton";
import styles from "./styles";
import { ReactNode } from "react";

export interface IMezonMenuItemProps {
    title: string,
    icon?: any,
    onPress?: () => void,
    expandable?: boolean,
    isLast?: boolean,
    component?: ReactNode
}
export default function MezonMenuItem({ isLast, title, expandable, icon, onPress, component }: IMezonMenuItemProps) {
    return (
        <MezonButton
            onPress={() => { onPress && onPress() }}
            viewContainerStyle={styles.btn}>
            {icon}
            <View style={[styles.btnTitleWrapper, !isLast && styles.borderBottom]}>
                <Text style={styles.btnTitle}>{title}</Text>
                {component}
            </View>
        </MezonButton>
    )
}