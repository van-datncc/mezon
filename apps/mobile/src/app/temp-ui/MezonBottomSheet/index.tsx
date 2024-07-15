import { BottomSheetModalProps, BottomSheetScrollView, BottomSheetModal as OriginalBottomSheet } from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useTheme } from '@mezon/mobile-ui';
import { ReactNode, Ref, forwardRef } from 'react';
import { Text, View } from 'react-native';
import Backdrop from './backdrop';
import { style } from './styles';

export interface IMezonBottomSheetProps extends BottomSheetModalProps {
	children: ReactNode;
	title?: string;
	titleSize?: 'sm' | 'md' | 'lg';
	headerLeft?: ReactNode;
	headerRight?: ReactNode;
	heightFitContent?: boolean;
	snapPoints?: string[];
}

export default forwardRef(function MezonBottomSheet(props: IMezonBottomSheetProps, ref: Ref<BottomSheetModalMethods>) {
	const { children, title, headerLeft, headerRight, heightFitContent, snapPoints = ['90%'], titleSize = 'sm' } = props;
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
			<BottomSheetScrollView>
				{(title || headerLeft || headerRight) && (
					<View style={styles.header}>
						<View style={[styles.section, styles.sectionLeft]}>{headerLeft}</View>
						<Text style={[styles.section, styles.sectionTitle, titleSize == 'md' ? styles.titleMD : {}]}>{title}</Text>
						<View style={[styles.section, styles.sectionRight]}>{headerRight}</View>
					</View>
				)}

				{children}
			</BottomSheetScrollView>
		</OriginalBottomSheet>
	);
});
