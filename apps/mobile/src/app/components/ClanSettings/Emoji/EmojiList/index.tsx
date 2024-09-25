import { DEFAULT_MAX_EMOJI_SLOTS } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { FlashList } from '@shopify/flash-list';
import { ClanEmoji } from 'mezon-js';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import EmojiDetail from '../EmojiDetail';
import { style } from './styles';

type EmojiListProps = {
	currentUserId: string;
	emojiList: ClanEmoji[];
};

const EmojiList = ({ emojiList, currentUserId }: EmojiListProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t } = useTranslation(['clanEmojiSetting']);
	const row: Array<any> = [];
	let prevOpenedRow: { close: () => void };
	const slots: number = useMemo(() => {
		return DEFAULT_MAX_EMOJI_SLOTS - emojiList.length;
	}, [emojiList]);

	const closeRow = (id: string) => {
		if (prevOpenedRow && prevOpenedRow !== row[parseInt(id)]) {
			prevOpenedRow.close();
		}
		prevOpenedRow = row[parseInt(id)];
	};

	const renderItem = ({ item }) => {
		return (
			<EmojiDetail
				item={item}
				currentUserId={currentUserId}
				key={item.id}
				ref={(ref) => (row[parseInt(item.id)] = ref)}
				onSwipeOpen={() => closeRow(item.id)}
			/>
		);
	};

	return (
		<View>
			<Text style={styles.emojiSlotsTitle}>{t('emojiList.slotsDetails', { slots })}</Text>
			<FlashList data={emojiList} keyExtractor={(item) => item.id} renderItem={renderItem} />
		</View>
	);
};

export default EmojiList;
