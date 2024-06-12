import { VerifyIcon } from "@mezon/mobile-components";
import { Text, View } from "react-native";
import styles from "./styles";

interface MezonBadgeProps {
    title: string
}

export default function MezonBadge({ title }: MezonBadgeProps) {
    return (
        <View style={styles.container}>
            <VerifyIcon height={16} width={16} />
            <Text style={styles.title}>{title}</Text>
        </View>
    )
}