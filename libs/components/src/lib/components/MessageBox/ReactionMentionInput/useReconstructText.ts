import { ETypeMEntion, IEmojiOnMessage, IHashtagOnMessage, IMentionOnMessage } from '@mezon/utils';
import { useEffect, useState } from 'react';
import { MentionItem } from 'react-mentions';

interface IReconstructedData {
	text: string;
	mentionsRaw: MentionItem[];
}

const useReconstructText = (mentionList: IMentionOnMessage[], hashtagList: IHashtagOnMessage[], emojiList: IEmojiOnMessage[]): IReconstructedData => {
	const [text, setText] = useState<string>('');
	const [mentionsRaw, setMentionsRaw] = useState<MentionItem[]>([]);

	useEffect(() => {
		let newText = '';
		const newMentionsRaw: MentionItem[] = [];

		const allItems = [
			...mentionList.map((mention) => ({
				type: ETypeMEntion.MENTION,
				id: mention.userid,
				display: mention.username,
				startindex: mention.startindex,
				endindex: mention.endindex,
			})),
			...hashtagList.map((hashtag) => ({
				type: ETypeMEntion.HASHTAG,
				id: hashtag.channelid,
				display: hashtag.channellabel,
				startindex: hashtag.startindex,
				endindex: hashtag.endindex,
			})),
			...emojiList.map((emoji) => ({
				type: ETypeMEntion.EMOJI,
				display: emoji.shortname,
				startindex: emoji.startindex,
				endindex: emoji.endindex,
			})),
		];

		// Sort items by startindex to maintain the correct order
		allItems.sort((a, b) => a.startindex - b.startindex);

		let currentIndex = 0;
		allItems.forEach((item) => {
			// Append text before the current item
			if (currentIndex < item.startindex) {
				newText += ' '.repeat(item.startindex - currentIndex);
				currentIndex = item.startindex;
			}
			// Append the item's display text
			newText += item.display;
			currentIndex += item.display.length;

			newMentionsRaw.push({
				id: item.id,
				display: item.display,
				plainTextIndex: item.startindex,
				childIndex: item.type,
			});
		});

		setText(newText);
		setMentionsRaw(newMentionsRaw);
	}, [mentionList, hashtagList, emojiList]);

	return { text, mentionsRaw };
};

export default useReconstructText;
