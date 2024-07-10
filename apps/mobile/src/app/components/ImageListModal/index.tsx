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
	const { themeValue } = useTheme();
	const styles = style(themeValue);

	const { visible, data, idxSelected, onClose, onImageChange, onImageChangeFooter } = props;
	const menuBottomSheetRef = useRef<BottomSheetModal>();

	const menu = useMemo(() => ([
		{
			items: [
				{
					title: "",
					icon: <Icons.DownloadIcon color={themeValue.text} />,
					onPress: () => reserve()
				},
				{
					title: "",
					// TODO: Nghia: Change icon
					icon: <Icons.DownloadIcon color={themeValue.text} />,
					onPress: () => reserve()
				},
				{
					title: "",
					icon: <Icons.WindowsMaximizeIcon color={themeValue.text} />,
					onPress: () => reserve()
				},
				{
					title: "",
					icon: <Icons.LinkIcon color={themeValue.text} />,
					onPress: () => reserve()
				},
			]
		}
	]) satisfies IMezonMenuSectionProps[], [])

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
		//  <MezonBottomSheet ref={menuBottomSheetRef}>
		// 	<MezonMenu menu={menu} />
		// </MezonBottomSheet>
	);
});
