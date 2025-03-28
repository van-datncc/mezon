import { selectCurrentClan, useAppSelector } from '@mezon/store';
import { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import styles from './styles';

interface ISticker {
	stickerList: any[];
	categoryName: string;
	onClickSticker: (sticker: any) => void;
}

export default memo(function Sticker({ stickerList, categoryName, onClickSticker }: ISticker) {
	const stickersListByCategoryName = stickerList.filter((sticker) => sticker.type === categoryName);
	const currentClan = useAppSelector(selectCurrentClan);

	return (
		<View style={styles.session} key={categoryName.toString() + 'stickers-parent'}>
			<Text style={styles.sessionTitle}>{categoryName !== 'custom' ? categoryName : currentClan?.clan_name}</Text>
			<View style={styles.sessionContent}>
				{stickersListByCategoryName.length > 0 &&
					stickersListByCategoryName.map((sticker, index) => (
						<TouchableOpacity onPress={() => onClickSticker(sticker)} style={styles.content} key={index.toString() + 'stickers'}>
							<FastImage
								source={{
									uri: sticker.url,
									cache: FastImage.cacheControl.immutable,
									priority: FastImage.priority.high
								}}
								style={{ height: '100%', width: '100%' }}
							/>
						</TouchableOpacity>
					))}
			</View>
		</View>
	);
});
