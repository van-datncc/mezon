import { ChannelsEntity, selectChannelsEntities } from '@mezon/store';
import {
	IEmojiOnMessage,
	IExtendedMessage,
	IHashtagOnMessage,
	ILinkOnMessage,
	ILinkVoiceRoomOnMessage,
	IMarkdownOnMessage,
	IMentionOnMessage,
	convertMarkdown,
} from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ChannelHashtag, EmojiMarkup, MarkdownContent, MentionUser, PlainText } from '../../components';

type MessageLineProps = {
	mode?: number;
	content?: IExtendedMessage;
	showOnchannelLayout?: boolean;
	onClickToMessage?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};
interface RenderContentProps {
	data: IExtendedMessage;
	mode: number;
	showOnchannelLayout?: boolean;
	allChannelVoice?: ChannelsEntity[];
}
type MessageElementToken = IMentionOnMessage | IHashtagOnMessage | IEmojiOnMessage | ILinkOnMessage | IMarkdownOnMessage | ILinkVoiceRoomOnMessage;

const isMentionOnMessage = (element: MessageElementToken): element is IMentionOnMessage => (element as IMentionOnMessage).username !== undefined;

const isHashtagOnMessage = (element: MessageElementToken): element is IHashtagOnMessage => (element as IHashtagOnMessage).channelid !== undefined;

const isEmojiOnMessage = (element: MessageElementToken): element is IEmojiOnMessage => (element as IEmojiOnMessage).shortname !== undefined;

const isLinkOnMessage = (element: MessageElementToken): element is ILinkOnMessage => (element as ILinkOnMessage).lk !== undefined;

const isMarkdownOnMessage = (element: MessageElementToken): element is IMarkdownOnMessage => (element as IMarkdownOnMessage).mk !== undefined;

const isLinkVoiceRoomOnMessage = (element: MessageElementToken): element is ILinkVoiceRoomOnMessage =>
	(element as ILinkVoiceRoomOnMessage).vk !== undefined;

// TODO: refactor component for message lines
const RenderContent = memo(({ data, mode, showOnchannelLayout, allChannelVoice }: RenderContentProps) => {
	const { t, mentions = [], hg = [], ej = [], mk = [], lk = [], vk = [] } = data;
	console.log('data: ', data);
	const elements = [...mentions, ...hg, ...ej, ...mk, ...lk, ...vk].sort((a, b) => (a.s ?? 0) - (b.s ?? 0));
	let lastindex = 0;
	const content = useMemo(() => {
		const formattedContent: React.ReactNode[] = [];

		elements.forEach((element, index) => {
			const s = element.s ?? 0;
			const e = element.e ?? 0;
			if (lastindex < s) {
				formattedContent.push(
					<PlainText showOnchannelLayout={showOnchannelLayout} key={`plain-${lastindex}`} text={t?.slice(lastindex, s) ?? ''} />,
				);
			}

			if (isHashtagOnMessage(element)) {
				formattedContent.push(
					<ChannelHashtag
						showOnchannelLayout={showOnchannelLayout}
						key={`hashtag-${index}-${s}-${element.channelid}`}
						channelHastagId={`<#${element.channelid}>`}
					/>,
				);
			}

			if (isMentionOnMessage(element)) {
				formattedContent.push(
					<MentionUser
						showOnchannelLayout={showOnchannelLayout}
						key={`mention-${index}-${s}-${element.username}-${element.user_id}`}
						tagName={element.username ?? ''}
						tagUserId={element.user_id ?? ''}
						mode={mode}
					/>,
				);
			}

			if (isEmojiOnMessage(element)) {
				formattedContent.push(
					<EmojiMarkup
						showOnChannelLayOut={showOnchannelLayout}
						key={`emoji-${index}-${s}-${element.shortname}`}
						emojiSyntax={element.shortname ?? ''}
						onlyEmoji={false}
						emojiId={element.emojiid ?? ''}
					/>,
				);
			}

			if (isLinkOnMessage(element)) {
				formattedContent.push(<MarkdownContent key={`link-${index}-${s}-${element.lk}`} content={element.lk as string} />);
			}

			if (isLinkVoiceRoomOnMessage(element)) {
				const meetingCode = element.vk?.split('/').pop();
				const voiceChannelFound = allChannelVoice?.find((channel) => channel.meeting_code === meetingCode) || null;
				voiceChannelFound
					? formattedContent.push(
							<ChannelHashtag
								showOnchannelLayout={showOnchannelLayout}
								key={`voicelink-${index}-${s}-${voiceChannelFound?.channel_id}`}
								channelHastagId={`<#${voiceChannelFound?.channel_id}>`}
							/>,
						)
					: formattedContent.push(<MarkdownContent key={`voicelink-${index}-${s}-${element.vk}`} content={element.vk as string} />);
			}

			if (isMarkdownOnMessage(element)) {
				const converted = element.mk?.startsWith('```') && element.mk?.endsWith('```') ? convertMarkdown(element.mk) : element.mk;
				formattedContent.push(<MarkdownContent key={`markdown-${index}-${s}-${element.mk}`} content={converted as string} />);
			}
			lastindex = e;
		});

		if (t && lastindex < t?.length) {
			formattedContent.push(<PlainText showOnchannelLayout={showOnchannelLayout} key={`plain-${lastindex}-end`} text={t.slice(lastindex)} />);
		}

		return formattedContent;
	}, [elements, t, mode]);
	return <div>{content}</div>;
});

const MessageLine = ({ mode, content, showOnchannelLayout, onClickToMessage }: MessageLineProps) => {
	const allChannels = useSelector(selectChannelsEntities);
	const allChannelVoice = Object.values(allChannels).flat();

	return (
		<div onClick={!showOnchannelLayout ? onClickToMessage : () => {}} className={`${showOnchannelLayout ? '' : 'cursor-pointer'}`}>
			<RenderContent
				data={content as IExtendedMessage}
				mode={mode ?? ChannelStreamMode.STREAM_MODE_CHANNEL}
				showOnchannelLayout={showOnchannelLayout}
				allChannelVoice={allChannelVoice}
			/>
		</div>
	);
};

export default memo(MessageLine);
