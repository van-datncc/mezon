import { Block, size, Text, useTheme } from '@mezon/mobile-ui';
import { selectMemberByUserId } from '@mezon/store';
import { convertTimeString } from '@mezon/utils';
import { clearTimeout } from '@testing-library/react-native/build/helpers/timers';
import React, { useEffect, useMemo, useRef } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { MezonClanAvatar } from '../../temp-ui';
import { style } from './styles';

interface IRenderFooterModalProps {
	ref?: any;
	data?: any;
	idxSelected?: number;
	onImageChangeFooter?: (idx: number) => void;
}

export const RenderFooterModal = React.memo((props: IRenderFooterModalProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { idxSelected, data, onImageChangeFooter } = props;
	const itemActive = useMemo(() => {
		return data?.[idxSelected] || {};
	}, [data, idxSelected]);
	const footerImagesModalRef = useRef<FlatList>(null);
	const uploader = useSelector(selectMemberByUserId(itemActive.uploader || ''));
	useEffect(() => {
		const timeout = setTimeout(() => {
			footerImagesModalRef?.current?.scrollToIndex({ animated: true, index: idxSelected });
		}, 200);
		return () => {
			clearTimeout(timeout);
		};
	}, [idxSelected]);

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
						<MezonClanAvatar
							alt={uploader?.user?.username}
							image={uploader?.user?.avatar_url}
						/>
					</View>
					<View style={styles.messageBoxTop}>
						<Text style={styles.userNameMessageBox}>{uploader?.user?.username || 'Anonymous'}</Text>
						<Text style={styles.dateMessageBox}>{itemActive?.create_time ? convertTimeString(itemActive?.create_time) : ''}</Text>
					</View>
				</Block>
			)}

			<FlatList
				ref={footerImagesModalRef}
				horizontal
				data={data}
				onScrollToIndexFailed={(info) => {
					const wait = new Promise((resolve) => setTimeout(resolve, 200));
					wait.then(() => {
						footerImagesModalRef.current?.scrollToIndex({ index: info.index, animated: true });
					});
				}}
				renderItem={({ item, index }) => (
					<TouchableOpacity
						activeOpacity={0.8}
						key={`${item.url}_${index}_ImagesModal`}
						onPress={() => {
							onImageChangeFooter(index);
						}}
					>
						<FastImage
							style={[styles.imageFooterModal, index === idxSelected && styles.imageFooterModalActive]}
							source={{
								uri: item.url,
								priority: FastImage.priority.normal,
							}}
							resizeMode={FastImage.resizeMode.cover}
						/>
					</TouchableOpacity>
				)}
			/>
		</View>
	);
});
