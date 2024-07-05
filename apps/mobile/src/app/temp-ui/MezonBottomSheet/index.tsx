import { BottomSheetModalProps, BottomSheetScrollView, BottomSheetModal as OriginalBottomSheet } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Ref } from "react";
import { forwardRef } from "react";
import { ReactNode } from "react";
import Backdrop from "./backdrop";
import { Text, View } from "react-native";
import { style } from "./styles";
import { useTheme } from "@mezon/mobile-ui";

export interface IMezonBottomSheetProps extends BottomSheetModalProps  {
    children: ReactNode,
    title?: string,
    headerLeft?: ReactNode,
    headerRight?: ReactNode,
    heightFitContent?: boolean,
    snapPoints?: string[]
}

export default forwardRef(function MezonBottomSheet(
    props: IMezonBottomSheetProps,
    ref: Ref<BottomSheetModalMethods>)
{
    const { children, title, headerLeft, headerRight, heightFitContent, snapPoints = ['90%'] } = props;
    const styles = style(useTheme().themeValue);
    return (
        <OriginalBottomSheet
            {...props}
            ref={ref}
            snapPoints={snapPoints}
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
                        <Text style={[styles.section, styles.sectionTitle]}>{title}</Text>
                        <View style={[styles.section, styles.sectionRight]}>{headerRight}</View>
                    </View>
                }

                {children}
            </BottomSheetScrollView>
        </OriginalBottomSheet >
    )
})

