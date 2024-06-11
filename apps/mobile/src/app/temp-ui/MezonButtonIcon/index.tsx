import { Text, View } from "react-native";
import styles from "./styles";
import { SvgProps } from "react-native-svg";
import { TouchableOpacity } from "@gorhom/bottom-sheet";

interface IMezonButtonIconProps {
    onPress?: () => void;
    icon: any;
    iconStyle?: SvgProps
    title: string;
}

export default function MezonButtonIcon({ title, icon: Icon, iconStyle, onPress }: IMezonButtonIconProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}>
            <View style={styles.iconWrapper}>
                <Icon height={28} width={28} {...iconStyle} />
            </View>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    )
}