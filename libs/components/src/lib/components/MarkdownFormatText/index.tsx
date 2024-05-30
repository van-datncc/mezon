import { useApp, useEmojiSuggestion, useInvite } from '@mezon/core';
import { convertMarkdown, getSrcEmoji } from '@mezon/utils';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { useModal } from 'react-modal-hook';
import remarkGFM from 'remark-gfm';
import ExpiryTimeModal from '../ExpiryTime';
import ChannelHashtag from './HashTag';
import MentionUser from './MentionUser';
import PreClass from './PreClass';
type MarkdownFormatTextProps = {
	lineMessage: string;
};

const MarkdownFormatText = ({ lineMessage }: MarkdownFormatTextProps) => {
	const { getLinkInvite } = useInvite();
	const [openInviteChannelModal, closeInviteChannelModal] = useModal(() => <ExpiryTimeModal onClose={closeInviteChannelModal} open={true} />);
	const getLinkinvite = (children: any) => {
		const inviteId = children.split('/invite/')[1];
		if (inviteId) {
			getLinkInvite(inviteId).then((res) => {
				if (res.expiry_time) {
					if (new Date(res.expiry_time) < new Date()) {
						openInviteChannelModal();
					} else {
						window.location.href = children;
					}
				}
			});
		} else {
			window.open(children, '_blank');
		}
	};
	const { appearanceTheme } = useApp();
	const backtickRegex = /`[^`]*`/g;
	const titleRegex = /^#{1,6}\s+.+$/;
	const numberedListRegex = /^\d+\.\s/gm;
	const italicRegex = /(?:^|\s)(_|\*)[^\s_*].*?\1(?:\s|$)/gm;

	const [isMarkdown, setIsMarkdown] = useState<boolean>(false);
	const startsWithTripleBackticks = lineMessage.startsWith('```');
	const endsWithNoTripleBackticks = !lineMessage.endsWith('```');
	const onlyBackticks = /^```$/.test(lineMessage);
	const [convertedLine, setConvertLine] = useState('');

	useEffect(() => {
		if (
			(startsWithTripleBackticks && endsWithNoTripleBackticks) ||
			backtickRegex.test(lineMessage) ||
			titleRegex.test(lineMessage) ||
			numberedListRegex.test(lineMessage) ||
			italicRegex.test(lineMessage)
		) {
			setIsMarkdown(true);
			const result = convertMarkdown(lineMessage);
			setConvertLine(result);
		} else {
			setIsMarkdown(false);
		}
	}, [lineMessage]);

	return (
		<article
			className={`prose-code:text-sm prose-hr:my-0 prose-headings:my-0 prose-headings:contents prose-h1:prose-2xl whitespace-pre-wrap prose prose-base prose-blockquote:leading-[6px] prose-blockquote:my-0 ${appearanceTheme === 'light' ? 'lightMode' : ''}`}
		>
			{isMarkdown ? (
				<div className="lineText contents">
					{(startsWithTripleBackticks && endsWithNoTripleBackticks) || onlyBackticks ? (
						<span>{lineMessage}</span>
					) : (
						<Markdown
							children={startsWithTripleBackticks && !endsWithNoTripleBackticks ? convertedLine : lineMessage}
							remarkPlugins={[remarkGFM]}
							components={{
								pre: PreClass,
								p: 'span',
								a: ({ children }) => (
									<span
										onClick={() => getLinkinvite(children)}
										rel="noopener noreferrer"
										style={{ color: 'rgb(59,130,246)', cursor: 'pointer' }}
										className="tagLink"
									>
										{children}
									</span>
								),
							}}
						/>
					)}
				</div>
			) : (
				<TextWithMentionHashtagEmoji lineMessage={lineMessage} />
			)}
		</article>
	);
};

export default MarkdownFormatText;

type TextWithMentionHashtagEmojiOpt = {
	lineMessage: string;
};

const TextWithMentionHashtagEmoji = ({ lineMessage }: TextWithMentionHashtagEmojiOpt) => {
	const atMentionRegex = /(?<=(\s|^))@\S+(?=\s|$)/g;
	const hashMentionRegex = /(?<=(\s|^))#\S+(?=\s|$)/g;
	const mentionDetectEmoji = /:\b[^:]*\b:/g;
	const { emojiListPNG } = useEmojiSuggestion();
	const splitText = lineMessage.split(' ');

	return (
		<div className="lineText contents">
			{splitText.map((item, index) => {
				const isMention = atMentionRegex.test(item);
				const isHashtag = hashMentionRegex.test(item);
				const isEmojiSyntax = mentionDetectEmoji.test(item);
				if (isMention && !isHashtag && !isEmojiSyntax) {
					return (
						<span>
							<MentionUser tagName={item} />{' '}
						</span>
					);
				}
				if (!isMention && isHashtag && !isEmojiSyntax) {
					return (
						<span>
							<ChannelHashtag channelHastagId={item} />{' '}
						</span>
					);
				}
				if (!isMention && !isHashtag && isEmojiSyntax) {
					return (
						<span>
							<img
								key={index}
								src={getSrcEmoji(item, emojiListPNG)}
								alt={getSrcEmoji(item, emojiListPNG)}
								className={`${splitText.length === 1 ? 'w-10' : 'w-6'}  h-auto  inline-block relative -top-0.5 m-0`}
								onDragStart={(e) => e.preventDefault()}
							/>{' '}
						</span>
					);
				}
				return <span>{item} </span>;
			})}
		</div>
	);
};
