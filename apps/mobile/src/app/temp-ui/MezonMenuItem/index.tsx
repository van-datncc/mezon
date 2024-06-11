import { StyleProp, Text, TextStyle, View } from "react-native";
import { MezonButton } from "../MezonButton";
import styles from "./styles";
import { ReactNode } from "react";
import { AngleRightIcon } from "@mezon/mobile-components";

export interface IMezonMenuItemProps {
    title: string,
    icon?: any,
    onPress?: () => void,
    expandable?: boolean,
    isLast?: boolean,
    component?: ReactNode,
    textStyle?: StyleProp<TextStyle>
}
export default function MezonMenuItem({ isLast, title, expandable, icon, onPress, component, textStyle }: IMezonMenuItemProps) {
    return (
        <MezonButton
            onPress={() => { onPress && onPress() }}
            viewContainerStyle={styles.btn}>
            {icon}
            <View style={[styles.btnTitleWrapper, !isLast && styles.borderBottom]}>
                <Text style={[styles.btnTitle, textStyle]}>{title}</Text>
                {component}
                {expandable && <AngleRightIcon height={24} width={24} />}
            </View>
        </MezonButton>
    )
}