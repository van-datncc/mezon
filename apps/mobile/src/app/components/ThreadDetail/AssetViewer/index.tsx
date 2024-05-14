import { Pressable, Text, View } from "react-native";
import styles from "./style"
import MemberListStatus from "../../MemberStatus";

const TabList = [
    { name: "Members" },
    { name: "Media" },
    { name: "Pin" },
    { name: "Link" },
    { name: "" }
]

interface IProps {
    activeId: number;
}

export default function AssetsViewer({ activeId }: IProps) {
    return (
        <View style={styles.container}>
            <View style={styles.headerTab}>
                {TabList.map((tab, index) => (
                    <Pressable key={index.toString()}>
                        <Text style={{ color: index === activeId ? "purple" : "white" }}>{tab.name}</Text>
                    </Pressable>
                ))}
            </View>

            <MemberListStatus />
        </View >
    )
}