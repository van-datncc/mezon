import { DEFAULT_MAX_EMOJI_SLOTS } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import { ClanEmoji } from 'mezon-js';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItem, Text, TextStyle } from 'react-native';
import { EmojiDetail } from '../EmojiDetail';
import { style } from './styles';

type EmojiListProps = {
	emojiList: ClanEmoji[];
	ListHeaderComponent: any;
};

type SlotsTextProps = {
	slots: number;
	styles: { emojiSlotsTitle: TextStyle };
	t: (key: string, options?: any) => string;
};

type ListItem = ClanEmoji | { id: string; clan_id?: string };

const MemoizedEmojiDetail = memo(EmojiDetail);

// Memoize the slots text component
const SlotsText = memo(({ slots, styles, t }: SlotsTextProps) => (
	<Text style={styles.emojiSlotsTitle}>{t('emojiList.slotsDetails', { slots })}</Text>
));

export const EmojiList = ({ emojiList, ListHeaderComponent }: EmojiListProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const { t } = useTranslation(['clanEmojiSetting']);
	const row: Array<any> = [];
	let prevOpenedRow: { close: () => void };
	const ITEM_HEIGHT = size.s_60;
	const SLOTS_TEXT_HEIGHT = size.s_40;

	const slots: number = useMemo(() => {
		return DEFAULT_MAX_EMOJI_SLOTS - emojiList.length;
	}, [emojiList]);

	const closeRow = (id: string) => {
		if (prevOpenedRow && prevOpenedRow !== row[parseInt(id)]) {
			prevOpenedRow.close();
		}
		prevOpenedRow = row[parseInt(id)];
	};

	const handleSwipe = useCallback((item: ClanEmoji) => {
		closeRow(item.id);
	}, []);

	const getItemLayout = useCallback(
		(data: any, index: number) => ({
			length: index === 0 ? SLOTS_TEXT_HEIGHT : ITEM_HEIGHT,
			offset: SLOTS_TEXT_HEIGHT + (index - 1) * ITEM_HEIGHT,
			index
		}),
		[ITEM_HEIGHT, SLOTS_TEXT_HEIGHT]
	);

	const keyExtractor = useCallback((item: ListItem) => `emoji_${item?.clan_id || 'text'}_${item?.id}`, []);

	const renderItem: ListRenderItem<ListItem> = useCallback(
		({ item }) => {
			if (item.id === 'renderTextTotal') {
				return <SlotsText slots={slots} styles={styles} t={t} />;
			}
			return (
				<MemoizedEmojiDetail
					item={item as ClanEmoji}
					ref={(ref) => {
						row[parseInt(item.id)] = ref;
					}}
					onSwipeOpen={handleSwipe}
				/>
			);
		},
		[handleSwipe, slots, styles, t, row]
	);

	const data = useMemo(() => [{ id: 'renderTextTotal' }, ...emojiList], [emojiList]);

	return (
		<FlatList
			data={data}
			keyExtractor={keyExtractor}
			initialNumToRender={5}
			maxToRenderPerBatch={3}
			windowSize={5}
			removeClippedSubviews={true}
			getItemLayout={getItemLayout}
			renderItem={renderItem}
			ListHeaderComponent={ListHeaderComponent}
			keyboardShouldPersistTaps="handled"
			onEndReachedThreshold={0.5}
			maintainVisibleContentPosition={{
				minIndexForVisible: 0,
				autoscrollToTopThreshold: 10
			}}
		/>
	);
};
