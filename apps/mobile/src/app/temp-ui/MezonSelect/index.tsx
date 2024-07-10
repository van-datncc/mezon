import MezonOption from "../MezonOption";
import { ReactNode } from "react";
import { useState } from "react";
import { useRef } from "react";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Icons } from "@mezon/mobile-components";
import MezonFakeInputBox from "../MezonFakeBox";
import { View } from "react-native";
import MezonBottomSheet from "../MezonBottomSheet";
import { useTheme } from "@mezon/mobile-ui";
import { style } from "./styles";

interface IMezonSelectProps {
    title?: string;
    icon?: ReactNode;
    onChange?: (value: number) => void;
    data: {
        description?: string;
        title: string;
        value: number | string;
    }[]
}

export default function MezonSelect({ data, onChange, icon, title }: IMezonSelectProps) {
    const { themeValue } = useTheme();
    const styles = style(themeValue);
    const [currentValue, setCurrentValue] = useState(0);
    const [currentContent, setCurrentContent] = useState(data?.[0]?.title || "unknown");
    const bottomSheetRef = useRef<BottomSheetModalMethods>();

    function handleChange(value: number) {
        setCurrentValue(value);
        setCurrentContent(data?.filter(item => item.value === value)?.[0]?.title || "unknown");
        bottomSheetRef?.current?.dismiss();
        onChange && onChange(value);
    }

    function handlePress() {
        bottomSheetRef?.current?.present();
    }

    return (
        <View>
            <MezonFakeInputBox
                title={title}
                value={currentContent}
                postfixIcon={<Icons.ChevronSmallRightIcon height={20} width={20} color={themeValue.text} />}
                onPress={handlePress}
            />

            <MezonBottomSheet ref={bottomSheetRef} heightFitContent title={title}>
                <View style={styles.bsContainer}>
                    <MezonOption data={data} onChange={handleChange} value={currentValue} />
                </View>
            </MezonBottomSheet>
        </View>
    )
}