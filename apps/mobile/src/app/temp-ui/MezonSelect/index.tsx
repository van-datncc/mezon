import { Text, TouchableOpacity, View } from "react-native";
import MezonBottomSheet from "../MezonBottomSheet";
import MezonOption from "../MezonOption";
import { ReactNode } from "react";
import styles from "./style";
import { useState } from "react";
import { useRef } from "react";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { AngleRightIcon, ArrowDownIcon } from "@mezon/mobile-components";

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
    const [currentValue, setCurrentValue] = useState(data?.[0]?.title || "unknown");
    const bottomSheetRef = useRef<BottomSheetModalMethods>();

    function handleChange(value: number) {
        setCurrentValue(data?.filter(item => item.value === value)?.[0]?.title || "unknown");
        bottomSheetRef?.current?.dismiss();
        onChange && onChange(value);
    }

    function handlePressBox() {
        bottomSheetRef?.current?.present();
    }

    return (
        <View>
            {title && <Text style={styles.sectionTitle}>{title}</Text>}
            
            <TouchableOpacity onPress={handlePressBox}>
                <View style={styles.box}>
                    {icon}
                    <Text style={styles.textBox}>{currentValue}</Text>
                    {/* TODO: Fix this */}
                    <AngleRightIcon height={20} width={20} />
                </View>
            </TouchableOpacity>

            <MezonBottomSheet ref={bottomSheetRef} heightFitContent>
                <View style={styles.bsContainer}>
                    <MezonOption data={data} onChange={handleChange} />
                </View>
            </MezonBottomSheet>
        </View>
    )
}