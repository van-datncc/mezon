import { useApp, useEmojiSuggestion, useInvite } from '@mezon/core';
import { convertMarkdown, getSrcEmoji } from '@mezon/utils';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { useModal } from 'react-modal-hook';
import { Link } from 'react-router-dom';
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
	const headingRegex = /^(#{1,6}) (.*)/gm;

	const numberedListRegex = /^\d+\.\s/gm;
	const italicRegex = /\*([^*]+)\*/g;
	const boldRegex = /\*\*([^*]+)\*\*/g;
	const boldItalicRegex = /\*\*\*([^*]+)\*\*\*/g;

	const [isMarkdown, setIsMarkdown] = useState<boolean>(false);
	const startsWithTripleBackticks = lineMessage?.startsWith('```');
	const startWithHttpOrHttps = lineMessage?.startsWith('https://') || lineMessage?.startsWith('http://');
	const endsWithNoTripleBackticks = !lineMessage?.endsWith('```');
	const onlyBackticks = /^```$/.test(lineMessage);
	const isQuote = lineMessage?.startsWith('>');
	const [convertedLine, setConvertLine] = useState('');

	useEffect(() => {
		if (
			(startsWithTripleBackticks && endsWithNoTripleBackticks) ||
			backtickRegex.test(lineMessage) ||
			headingRegex.test(lineMessage) ||
			numberedListRegex.test(lineMessage) ||
			italicRegex.test(lineMessage) ||
			boldRegex.test(lineMessage) ||
			boldItalicRegex.test(lineMessage) ||
			startWithHttpOrHttps ||
			isQuote
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
			className={`prose-code:text-sm prose-hr:my-0 prose-headings:my-0
			prose-headings:contents prose-h1:prose-2xl whitespace-pre-wrap prose
			prose-base prose-blockquote:leading-[6px] prose-blockquote:my-0 leading-[0] ${appearanceTheme === 'light' ? 'lightMode' : ''}`}
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
	const combinedRegex = /(@\S+|#\S+|:\b[^:]*\b:)/g;
	const { emojiListPNG } = useEmojiSuggestion();
	const splitText = lineMessage?.split(combinedRegex).filter(Boolean);

	const checkMarkdownInText = (text: string) => {
		if (text.startsWith('```') && !text.endsWith('```')) return true;
		if (/^```$/.test(text)) return true;
	};

	const checkIsLink = (text: string) => {
		if (text.includes('https://') || text.includes('http://')) return true;
	};

	return (
		<div className="lineText contents">
			{splitText?.map((item, index) => {
				const isMention = item.startsWith('@');
				const isHashtag = item.startsWith('#');
				const isEmojiSyntax = item.match(/:\b[^:]*\b:/);

				if (isMention && !isHashtag && !isEmojiSyntax) {
					return (
						<span key={`mention-${index}`}>
							<MentionUser tagName={item} />{' '}
						</span>
					);
				} else if (!isMention && isHashtag && !isEmojiSyntax) {
					return (
						<span key={`hashtag-${index}`}>
							<ChannelHashtag channelHastagId={item} />{' '}
						</span>
					);
				} else if (checkMarkdownInText(item)) {
					return (
						<span key={`markdown-text-${index}`} className="lineText contents">
							{item}
						</span>
					);
				} else if (checkIsLink(item)) {
					const extractUrl = (text: string) => {
						const urlMatch = text.match(/https?:\/\/\S+/);
						return urlMatch ? urlMatch[0] : '#';
					};
					const url = extractUrl(item);
					if (!url) {
						return <span key={`no-url-text-${index}`}>{item}</span>;
					}
					const parts = item.split(extractUrl(item));

					return (
						<span key={`url-on-text-${index}`}>
							{parts[0]}
							<Link
								style={{ textDecoration: 'none' }}
								to={url}
								className="px-1  cursor-pointer inline whitespace-nowrap !text-[#3B82F6] hover:!underline font-thin "
							>
								{url}
							</Link>
							{parts[1]}
						</span>
					);
				} else if (!isMention && !isHashtag && isEmojiSyntax) {
					return (
						<span key={`emoji-${index}`} style={{ userSelect: 'none' }}>
							<img
								src={getSrcEmoji(item, emojiListPNG)}
								alt={getSrcEmoji(item, emojiListPNG)}
								className={`${splitText.length === 1 ? 'w-10' : 'w-6'}  h-auto  inline-block relative -top-0.5 m-0`}
								onDragStart={(e) => e.preventDefault()}
							/>{' '}
						</span>
					);
				}
				return <span key={`text-${index}`}>{item}</span>;
			})}
		</div>
	);
};
