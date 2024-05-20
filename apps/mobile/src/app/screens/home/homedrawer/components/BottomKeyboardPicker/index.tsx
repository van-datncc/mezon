import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { Ref, forwardRef } from 'react';
import styles from './styles';

export type IModeKeyboardPicker = 'text' | 'emoji' | 'attachment';

interface IProps {
	height: number;
	children: React.ReactNode;
}

export default forwardRef(function BottomKeyboardPicker({ height = 1, children }: IProps, ref: Ref<BottomSheetMethods>) {
	return (
		<BottomSheet ref={ref} snapPoints={[height === 0 ? 1 : height, '100%']} animateOnMount>
			<BottomSheetView style={styles.contentContainer}>{children}</BottomSheetView>
		</BottomSheet>
	);
});
