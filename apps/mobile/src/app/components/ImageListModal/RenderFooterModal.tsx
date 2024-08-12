import { Block, size, Text, useTheme } from '@mezon/mobile-ui';
import { selectMemberByUserId } from '@mezon/store';
import { convertTimeString } from '@mezon/utils';
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { MezonClanAvatar } from '../../temp-ui';
import { style } from './styles';

interface IRenderFooterModalProps {
	item?: any;
}

export const RenderFooterModal = React.memo((props: IRenderFooterModalProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { item } = props;
	const uploader = useSelector(selectMemberByUserId(item.uploader || ''));

	return (
		<View style={styles.wrapperFooterImagesModal}>
			{!!uploader && (
				<Block
					flexDirection={'row'}
					alignSelf={'flex-start'}
					alignItems={'center'}
					gap={size.s_6}
					paddingBottom={size.s_14}
					paddingHorizontal={size.s_10}
				>
					<View style={styles.wrapperAvatar}>
						<MezonClanAvatar alt={uploader?.user?.username} image={uploader?.user?.avatar_url} />
					</View>
					<View style={styles.messageBoxTop}>
						<Text style={styles.userNameMessageBox}>{uploader?.user?.username || 'Anonymous'}</Text>
						<Text style={styles.dateMessageBox}>{item?.create_time ? convertTimeString(item?.create_time) : ''}</Text>
					</View>
				</Block>
			)}
		</View>
	);
});
