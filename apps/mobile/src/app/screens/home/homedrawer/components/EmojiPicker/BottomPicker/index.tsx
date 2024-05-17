import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import styles from "./styles";
import { Text } from "react-native";
import { forwardRef } from "react";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Ref } from "react";

interface IProps {
    height: number;
}

export default forwardRef(function BottomPicker({ height = 1 }: IProps, ref: Ref<BottomSheetMethods>) {
    return (
        <BottomSheet
            ref={ref}
            index={-1}
            snapPoints={[height === 0 ? 1 : height, '100%']}
            animateOnMount
        >
            <BottomSheetView style={styles.contentContainer}>
                <Text>Awesome 🎉</Text>
            </BottomSheetView>
        </BottomSheet>
    )
}) 