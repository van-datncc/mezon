import { Text, View } from "react-native";
import styles from "./styles";
import { TouchableOpacity } from "@gorhom/bottom-sheet";

interface IMezonButtonIconProps {
    onPress?: () => void;
    icon: any;
    title: string;
}

export default function MezonButtonIcon({ title, icon, onPress }: IMezonButtonIconProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}>
            <View style={styles.iconWrapper}>
                {icon}
            </View>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    )
}