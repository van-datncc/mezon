import { BottomSheetScrollView, BottomSheetModal as OriginalBottomSheet } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Ref } from "react";
import { forwardRef } from "react";
import styles from "./styles";
import { ReactNode } from "react";
import Backdrop from "./components/backdrop";

interface IProps {
    children: ReactNode
}

export default forwardRef(function BottomSheet({ children }: IProps, ref: Ref<BottomSheetModalMethods>) {
    return (
        <OriginalBottomSheet
            ref={ref}
            snapPoints={['90%']}
            index={0}
            animateOnMount
            backgroundStyle={styles.backgroundStyle}
            backdropComponent={Backdrop}
        >
            <BottomSheetScrollView >
                {children}
            </BottomSheetScrollView>
        </OriginalBottomSheet >
    )
})

