import { ScrollView, Text, View } from "react-native";
import styles from "./styles";
import { useTranslation } from "react-i18next";
import { APP_SCREEN, MenuClanScreenProps } from "../../../navigation/ScreenTypes";
import { MezonDateTimePicker, MezonInput, MezonSelect } from "../../../temp-ui";
import MezonButton from "../../../temp-ui/MezonButton2";
import { useState } from "react";
import { getNearTime } from "@mezon/mobile-components";

type CreateEventScreenDetails = typeof APP_SCREEN.MENU_CLAN.CREATE_EVENT_DETAIL;
export default function EventCreatorDetails({ navigation }: MenuClanScreenProps<CreateEventScreenDetails>) {
    const { t } = useTranslation(['eventCreator']);

    navigation.setOptions({
        headerTitle: t('screens.eventDetails.headerTitle')
    })

    function handlePressNext() {
        navigation.navigate(APP_SCREEN.MENU_CLAN.CREATE_EVENT_PREVIEW);
    }

    const options = [
        {
            title: t('fields.eventFrequency.notRepeat'),
            value: 0
        },
        {
            title: t('fields.eventFrequency.weeklyOn'),
            value: 1
        },
        {
            title: t('fields.eventFrequency.everyOther'),
            value: 2
        },
        {
            title: t('fields.eventFrequency.monthlyOn'),
            value: 3
        },
        {
            title: t('fields.eventFrequency.annuallyOn'),
            value: 4
        },
        {
            title: t('fields.eventFrequency.everyWeekday'),
            value: 5
        },
    ]

    const [eventTitle, setEventTitle] = useState<string>("");
    const [eventDescription, setEventDescription] = useState<string>("");
    const [startTime, setStartTime] = useState<Date>(getNearTime(120));
    const [endTime, setEndTime] = useState<Date>(getNearTime(240));
    const [eventFrequency, setEventFrequency] = useState<number>(0);

    function handleFrequencyChange(value: number) {
        setEventFrequency(value);
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.feedSection}>
                <View style={styles.headerSection}>
                    <Text style={styles.title}>{t('screens.eventDetails.title')}</Text>
                    <Text style={styles.subtitle}>{t('screens.eventDetails.subtitle')}</Text>
                </View>

                <View style={styles.section}>
                    <MezonInput label={t("fields.eventName.title")} value={eventTitle} onTextChange={setEventTitle} />

                    <View style={styles.inlineSec}>
                        <View style={{ flex: 2 }}>
                            <MezonDateTimePicker
                                title={t('fields.startDate.title')}
                                onChange={(value) => setStartTime(value)}
                                value={startTime}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <MezonDateTimePicker
                                title={t('fields.startTime.title')}
                                mode="time"
                                onChange={(value) => setStartTime(value)}
                                value={startTime}
                            />
                        </View>
                    </View>

                    <View style={styles.inlineSec}>
                        <View style={{ flex: 2 }}>
                            <MezonDateTimePicker
                                title={t('fields.endDate.title')}
                                onChange={(value) => setEndTime(value)}
                                value={endTime}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <MezonDateTimePicker
                                title={t('fields.endTime.title')}
                                mode="time"
                                onChange={(value) => setEndTime(value)}
                                value={endTime}
                            />
                        </View>
                    </View>

                    <MezonInput
                        label={t("fields.description.title")}
                        value={eventDescription}
                        onTextChange={setEventDescription}
                        textarea
                    />

                    <MezonSelect
                        title={t('fields.eventFrequency.title')}
                        data={options}
                        onChange={handleFrequencyChange}
                    />
                </View>
            </View>

            <MezonButton
                title={t('actions.next')}
                type="success"
                onPress={handlePressNext}
            />
        </ScrollView>
    )
}