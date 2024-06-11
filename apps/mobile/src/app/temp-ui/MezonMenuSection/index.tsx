import { Text, View } from "react-native";
import styles from "./styles";
import MezonMenuItem, { IMezonMenuItemProps } from "../MezonMenuItem";

export interface IMezonMenuSectionProps {
    title?: string;
    items: IMezonMenuItemProps[]
}

export default function MezonMenuSection({ title, items }: IMezonMenuSectionProps) {
    return (
        <View
            style={styles.sectionWrapper}>
            {title && <Text style={styles.sectionTitle}>{title}</Text>}
            <View style={styles.section}>
                {items.map((item, index) => (
                    <MezonMenuItem
                        isLast={index === items.length - 1}
                        key={index.toString()}
                        {...item}
                    />
                ))}
            </View>
        </View>
    )
}