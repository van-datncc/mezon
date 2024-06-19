import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MezonBottomSheet from "../MezonBottomSheet";
import { useRef } from "react";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import styles from "./styles";
import DatePicker from 'react-native-date-picker'
import { useState } from "react";
import { CloseIcon, getNearTime } from "@mezon/mobile-components";
import MezonFakeBox from "../MezonFakeBox";

interface IMezonDateTimePicker {
    mode?: "datetime" | "date" | "time",
    title?: string;
    onChange?: (time: Date) => void;
    value?: Date
}

export default function MezonDateTimePicker({ mode = "date", title, onChange, value }: IMezonDateTimePicker) {
    const bottomSheetRef = useRef<BottomSheetModalMethods>();
    const [date, setDate] = useState(value || getNearTime(120))
    const [currentDate, setCurrentDate] = useState(value || getNearTime(120));

    function handleChange() {
        setCurrentDate(date);
        bottomSheetRef?.current?.dismiss();
        onChange && onChange(date);
    }

    function handleClose() {
        bottomSheetRef?.current?.dismiss();
    }

    function handlePress() {
        bottomSheetRef?.current?.present();
    }

    return (
        <View>
            <MezonFakeBox
                title={title}
                value={mode === "time"
                    ? currentDate.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                    : currentDate.toLocaleDateString([], {
                        year: 'numeric',
                        month: "short",
                        day: 'numeric'
                    })}
                onPress={handlePress}
            />

            <MezonBottomSheet
                ref={bottomSheetRef}
                heightFitContent
                title={title}
                headerLeft={
                    <TouchableOpacity onPress={handleClose}>
                        <CloseIcon height={16} width={16} />
                    </TouchableOpacity>
                }
                headerRight={
                    <TouchableOpacity onPress={handleChange}>
                        <Text style={styles.textApply}>Apply</Text>
                    </TouchableOpacity>
                }
            >
                <View style={styles.bsContainer}>
                    <DatePicker date={date} onDateChange={setDate} mode={mode} />
                </View>
            </MezonBottomSheet>
        </View>
    )
}