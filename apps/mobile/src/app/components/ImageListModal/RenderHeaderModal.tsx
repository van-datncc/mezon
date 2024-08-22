import { Icons } from '@mezon/mobile-components';
import { Block, Colors, size, Text, useTheme } from '@mezon/mobile-ui';
import { AttachmentEntity, selectMemberByUserId } from '@mezon/store-mobile';
import { convertTimeString } from '@mezon/utils';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { MezonClanAvatar } from '../../temp-ui';
import { style } from './styles';

interface IRenderFooterModalProps {
	onClose?: () => void;
	imageSelected?: AttachmentEntity;
}

export const RenderHeaderModal = React.memo(({ onClose, imageSelected }: IRenderFooterModalProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const uploader = useSelector(selectMemberByUserId(imageSelected?.uploader || ''));

	const handleDownloadImage = () => {
		//TODO: handle download image
	}
	return (
		<Block
			position='absolute'
			top={0}
			left={0}
			zIndex={1}
			justifyContent='space-between'
			flexDirection='row'
			backgroundColor='rgba(0, 0, 0, 0.4)'
			width='100%'
			padding={size.s_10}
			alignItems='center'
		>
			<Block flexDirection='row' alignItems='center' gap={size.s_10}>
				<TouchableOpacity onPress={onClose}>
					<Icons.ArrowLargeLeftIcon color={Colors.white} />
				</TouchableOpacity>
				{!!uploader && (
					<Block
						flexDirection={'row'}
						alignItems={'center'}
						gap={size.s_6}
					>
						<Block style={styles.wrapperAvatar}>
							<MezonClanAvatar alt={uploader?.user?.username} image={uploader?.user?.avatar_url} />
						</Block>
						<Block style={styles.messageBoxTop}>
							<Text style={styles.userNameMessageBox}>{uploader?.user?.username || 'Anonymous'}</Text>
							<Text style={styles.dateMessageBox}>{imageSelected?.create_time ? convertTimeString(imageSelected?.create_time) : ''}</Text>
						</Block>
					</Block>
				)}
			</Block>
			<TouchableOpacity onPress={handleDownloadImage}>
				<Icons.DownloadIcon color={Colors.white} />
			</TouchableOpacity>
		</Block>
	);
});
