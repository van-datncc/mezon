import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { useEventManagement } from "@mezon/core";
import { View } from "react-native";
import EventItem from "./EventItem";
import styles from "./styles";

export default function EventViewer() {
    const { dismiss } = useBottomSheetModal()
    const { allEventManagement } = useEventManagement();

    return (
        <View style={styles.container}>
            {allEventManagement.map((event, index) => (
                <EventItem event={event} key={index.toString()} />
            ))}
        </View>
    );
}