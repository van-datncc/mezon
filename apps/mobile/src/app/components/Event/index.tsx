import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Text, View } from "react-native";
import EventItem from "./EventItem";
import { style } from "./styles";
import { useRef } from "react";
import { EventManagementEntity, selectAllEventManagement } from "@mezon/store-mobile";
import EventDetail from "./EventDetail";
import { useState } from "react";
import { MezonBottomSheet, MezonTab } from "../../temp-ui";
import EventMember from "./EventMember";
import { useSelector } from "react-redux";
import { useTheme } from "@mezon/mobile-ui";
import { Icons } from "@mezon/mobile-components";

export default function EventViewer() {
    // const { dismiss } = useBottomSheetModal()
    const { themeValue } = useTheme();
    const styles = style(themeValue);
    const allEventManagement = useSelector(selectAllEventManagement);
    const [currentEvent, setCurrentEvent] = useState<EventManagementEntity>();
    const bottomSheetDetail = useRef<BottomSheetModal>(null)

    function handlePress(event: EventManagementEntity) {
        setCurrentEvent(event);
        bottomSheetDetail?.current.present();
    }

    return (
        <View style={styles.container}>
            {allEventManagement?.length > 0
                ? allEventManagement?.map((event, index) => (
                    <EventItem event={event} key={index.toString()} onPress={() => handlePress(event)} />
                ))
                : <View style={styles.emptyView}>
                    <View style={styles.iconWrapper}>
                        <Icons.CalendarIcon height={48} width={48} color={themeValue.text} />
                    </View>
                    <Text style={styles.emptyText}>There are no upcoming events.</Text>
                    <Text style={styles.emptyTextDescription}>{"Schedule an event for any planned activity in your server. You can give other people permission to create event in Server Settings > Roles "}</Text>
                </View>
            }

            <MezonBottomSheet ref={bottomSheetDetail}>
                <MezonTab
                    views={[
                        <EventDetail event={currentEvent} />,
                        <EventMember event={currentEvent} />
                    ]}
                    titles={["Event Info", "Interested"]}
                />
            </MezonBottomSheet>
        </View>
    );
}