import EmojiSelectorContainer from '../EmojiSelectorContainer';

type EmojiSelectorProps = {
	onSelected: (emojiId: string, shortname: string) => void;
	searchText?: string;
	isReactMessage?: boolean;
	handleBottomSheetExpand?: () => void;
	handleBottomSheetCollapse?: () => void;
	onScroll?: (e: any) => void;
};

export default function EmojiSelector({
	onSelected,
	isReactMessage = false,
	handleBottomSheetExpand,
	handleBottomSheetCollapse,
	onScroll
}: EmojiSelectorProps) {
	return (
		<EmojiSelectorContainer
			handleBottomSheetExpand={handleBottomSheetExpand}
			handleBottomSheetCollapse={handleBottomSheetCollapse}
			onSelected={onSelected}
			isReactMessage={isReactMessage}
			onScroll={onScroll}
		/>
	);
}
