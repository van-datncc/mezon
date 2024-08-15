import { useTheme } from '@mezon/mobile-ui';
import { ClanEmoji } from 'mezon-js';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import EmojiDetail from '../EmojiDetail';
import { style } from './styles';

type EmojiListProps = {
	emojiList: ClanEmoji[];
};

const EmojiList = ({ emojiList }: EmojiListProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t } = useTranslation(['clanEmojiSetting']);
	const row: Array<any> = [];
	let prevOpenedRow: { close: () => void };
	const slots: number = useMemo(() => {
		return 250 - emojiList.length;
	}, [emojiList]);

	const closeRow = (id: string) => {
		if (prevOpenedRow && prevOpenedRow !== row[parseInt(id)]) {
			prevOpenedRow.close();
		}
		prevOpenedRow = row[parseInt(id)];
	};

	return (
		<View>
			<Text style={styles.emojiSlotsTitle}>{t('emojiList.slotsDetails', { slots })}</Text>
			{emojiList.map((item) => (
				<EmojiDetail item={item} key={item.id} ref={(ref) => (row[parseInt(item.id)] = ref)} onSwipeOpen={() => closeRow(item.id)} />
			))}
		</View>
	);
};

export default EmojiList;
