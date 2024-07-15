import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MezonBottomSheet from "../MezonBottomSheet";
import { useRef } from "react";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import DatePicker from 'react-native-date-picker'
import { useState } from "react";
import { getNearTime, Icons } from "@mezon/mobile-components";
import MezonFakeInputBox, { IMezonFakeBoxProps } from "../MezonFakeBox";
import { useEffect } from "react";
import { memo } from "react";
import { useCallback } from "react";
import { ThemeModeBase, useTheme } from "@mezon/mobile-ui";
import { style } from "./styles";

type IMezonDateTimePicker = Omit<IMezonFakeBoxProps, "onPress" | "postfixIcon" | "value"> & {
    mode?: "datetime" | "date" | "time",
    onChange?: (time: Date) => void;
    value?: Date,
    keepTime?: boolean
}

export default memo(function MezonDateTimePicker({ mode = "date", onChange, value, keepTime, ...props }: IMezonDateTimePicker) {
    const { themeValue, themeBasic } = useTheme();
    const styles = style(themeValue);
    const bottomSheetRef = useRef<BottomSheetModalMethods>();
    const [date, setDate] = useState(value || getNearTime(120))
    const [currentDate, setCurrentDate] = useState(value || getNearTime(120));

	useEffect(() => {
		setDate(value || getNearTime(120));
		setCurrentDate(value || getNearTime(120));
	}, [value]);

	const handleChange = useCallback(() => {
		if (keepTime && mode !== 'time' && value) {
			const new_date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), value.getHours(), value.getMinutes(), value.getSeconds());

			setCurrentDate(new_date);
			onChange && onChange(new_date);
		} else {
			setCurrentDate(date);
			onChange && onChange(date);
		}
		bottomSheetRef?.current?.dismiss();
	}, [keepTime, mode, value, date]);

	function handleClose() {
		bottomSheetRef?.current?.dismiss();
	}

	function handlePress() {
		bottomSheetRef?.current?.present();
	}

    return (
        <View>
            <MezonFakeInputBox
                {...props}
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
                title={props.title}
                headerLeft={
                    <TouchableOpacity onPress={handleClose}>
                        <Icons.CloseIcon height={16} width={16} color={themeValue.text} />
                    </TouchableOpacity>
                }
                headerRight={
                    <TouchableOpacity onPress={handleChange}>
                        <Text style={styles.textApply}>Apply</Text>
                    </TouchableOpacity>
                }
            >
                <View style={styles.bsContainer}>
                    <DatePicker
                        date={date}
                        onDateChange={setDate}
                        mode={mode}
                        theme={themeBasic === ThemeModeBase.DARK ? "dark" : "light"}
                    />
                </View>
            </MezonBottomSheet>
        </View>
    )
});
