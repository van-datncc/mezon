import { useEffect, useState } from 'react';
import EmojiSelectorContainer from '../EmojiSelectorContainer';

type EmojiSelectorProps = {
	onSelected: (emojiId: string, shortname: string) => void;
	searchText?: string;
	isReactMessage?: boolean;
	handleBottomSheetExpand?: () => void;
	handleBottomSheetCollapse?: () => void;
};

export default function EmojiSelector({
	onSelected,
	isReactMessage = false,
	handleBottomSheetExpand,
	handleBottomSheetCollapse
}: EmojiSelectorProps) {
	const [isReadyForUse, setIsReadyForUse] = useState<boolean>(false);
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsReadyForUse(true);
		}, 200);
		return () => timer && clearTimeout(timer);
	}, []);
	if (!isReadyForUse) {
		return null;
	}
	return (
		<EmojiSelectorContainer
			handleBottomSheetExpand={handleBottomSheetExpand}
			handleBottomSheetCollapse={handleBottomSheetCollapse}
			onSelected={onSelected}
			isReactMessage={isReactMessage}
		/>
	);
}
