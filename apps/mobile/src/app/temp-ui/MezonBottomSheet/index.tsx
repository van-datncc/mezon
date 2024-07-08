import { BottomSheetScrollView, BottomSheetModal as OriginalBottomSheet } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Ref } from "react";
import { forwardRef } from "react";
import { ReactNode } from "react";
import Backdrop from "./backdrop";
import { StyleProp, Text, View } from "react-native";
import { style } from "./styles";
import { useTheme } from "@mezon/mobile-ui";

export interface IMezonBottomSheetProps {
    children: ReactNode,
    title?: string,
    titleSize?: "sm" | "md" | "lg",
    headerLeft?: ReactNode,
    headerRight?: ReactNode,
    heightFitContent?: boolean
}

export default forwardRef(function MezonBottomSheet(
    { children, title, headerLeft, headerRight, heightFitContent, titleSize = "sm" }: IMezonBottomSheetProps,
    ref: Ref<BottomSheetModalMethods>) {
    const styles = style(useTheme().themeValue);
    return (
        <OriginalBottomSheet
            ref={ref}
            snapPoints={['90%']}
            index={0}
            animateOnMount
            backgroundStyle={styles.backgroundStyle}
            backdropComponent={Backdrop}
            enableDynamicSizing={heightFitContent}
            handleIndicatorStyle={styles.handleIndicator}
        >
            <BottomSheetScrollView >
                {(title || headerLeft || headerRight) &&
                    <View style={styles.header}>
                        <View style={[styles.section, styles.sectionLeft]}>{headerLeft}</View>
                        <Text style={[styles.section, styles.sectionTitle, titleSize == "md" ? styles.titleMD : {}]}>{title}</Text>
                        <View style={[styles.section, styles.sectionRight]}>{headerRight}</View>
                    </View>
                }

                {children}
            </BottomSheetScrollView>
        </OriginalBottomSheet >
    )
})

