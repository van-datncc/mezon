import React from 'react';
import ImageView from 'react-native-image-view';
import { RenderFooterModal } from './RenderFooterModal';
import { IMezonMenuSectionProps, MezonBottomSheet, MezonMenu, reserve } from '../../temp-ui';
import { useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useMemo } from 'react';
import { Icons } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { style } from './styles';

interface IImageListModalProps {
	data?: any;
	visible?: boolean;
	idxSelected?: number;
	onImageChange?: (idx: number) => void;
	onImageChangeFooter?: (idx: number) => void;
	onClose?: () => void;
}

export const ImageListModal = React.memo((props: IImageListModalProps) => {
	const { visible, data, idxSelected, onClose, onImageChange, onImageChangeFooter } = props;

	return (
		<ImageView
			animationType={'fade'}
			images={data || []}
			imageIndex={idxSelected}
			isVisible={visible}
			isSwipeCloseEnabled={true}
			onImageChange={(idx: number) => {
				onImageChange(idx);
			}}
			controls={{
				next: true,
				prev: true,
				close: true,
			}}
			onClose={onClose}
			renderFooter={() => <RenderFooterModal data={data || []} idxSelected={idxSelected} onImageChangeFooter={onImageChangeFooter} />}
		/>
	);
});
