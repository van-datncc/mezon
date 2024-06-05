import { useApp, useEmojiSuggestion, useInvite } from '@mezon/core';
import { ILineMention, MentionTypeEnum, checkMarkdownInText, convertMarkdown, getSrcEmoji } from '@mezon/utils';
import Markdown from 'react-markdown';
import { useModal } from 'react-modal-hook';
import remarkGFM from 'remark-gfm';
import ExpiryTimeModal from '../ExpiryTime';
import ChannelHashtag from './HashTag';
import MentionUser from './MentionUser';
import PreClass from './PreClass';
type MarkdownFormatTextProps = {
	mentions: ILineMention[];
};

const MarkdownFormatText = ({ mentions }: MarkdownFormatTextProps) => {
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

	console.log(mentions);

	const checkMention = (syntax: string) => {
		const isMention = syntax.startsWith('@');
		const isHashtag = syntax.startsWith('#');
		const isEmojiSyntax = syntax.match(/:\b[^:]*\b:/g);
		console.log(isEmojiSyntax);
		if (isMention && !isHashtag && !isEmojiSyntax) {
			return MentionTypeEnum.MENTION;
		} else if (!isMention && isHashtag && !isEmojiSyntax) {
			return MentionTypeEnum.HASHTAG;
		} else {
			return MentionTypeEnum.EMOJI_SYNTAX;
		}
	};

	return (
		<article
			className={`prose-code:text-sm prose-hr:my-0 prose-headings:my-0 prose-headings:contents prose-h1:prose-2xl whitespace-pre-wrap prose prose-base prose-blockquote:leading-[6px] prose-blockquote:my-0 ${appearanceTheme === 'light' ? 'lightMode' : ''}`}
		>
			{mentions.map((part, index) => {
				const tagName = part.matchedText;
				const markdown = (part.nonMatchText && part.nonMatchText.trim()) ?? '';
				const startsWithTripleBackticks = markdown.startsWith('```');
				const endsWithNoTripleBackticks = !markdown.endsWith('```');
				const onlyBackticks = /^```$/.test(markdown);
				const result = convertMarkdown(markdown);

				return (
					<div key={index} className="lineText contents">
						{(startsWithTripleBackticks && endsWithNoTripleBackticks) || onlyBackticks ? (
							<span>{markdown}</span>
						) : (
							<Markdown
								children={startsWithTripleBackticks && !endsWithNoTripleBackticks ? result : markdown}
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
						{markdown && ' '}
						{tagName && (
							<span>
								{checkMention(tagName) === MentionTypeEnum.MENTION ? (
									<MentionUser tagName={tagName} />
								) : checkMention(tagName) === MentionTypeEnum.HASHTAG ? (
									<ChannelHashtag channelHastagId={tagName} />
								) : (
									<EmojiMarkdown emojiSyntax={tagName} />
								)}
							</span>
						)}{' '}
					</div>
				);
			})}
		</article>
	);
};

export default MarkdownFormatText;

type EmojiMarkdownOpt = {
	emojiSyntax: string;
	onlyEmoji?: boolean;
};

const EmojiMarkdown = ({ emojiSyntax, onlyEmoji }: EmojiMarkdownOpt) => {
	const { emojiListPNG } = useEmojiSuggestion();

	return (
		<span style={{ userSelect: 'none' }}>
			<img
				src={getSrcEmoji(emojiSyntax, emojiListPNG)}
				alt={getSrcEmoji(emojiSyntax, emojiListPNG)}
				className={`${onlyEmoji ? 'w-10' : 'w-6'}  h-auto  inline-block relative -top-0.5 m-0`}
				onDragStart={(e) => e.preventDefault()}
			/>{' '}
		</span>
	);
};

type TextWithMentionHashtagEmojiOpt = {
	lineMessage: string;
};

const TextWithMentionHashtagEmoji = ({ lineMessage }: TextWithMentionHashtagEmojiOpt) => {
	const modified = lineMessage.replace("':\n'", "':\n '");
	const combinedRegex = /(@\S+|#\S+|:\b[^:]*\b:|`(.*?)`)/g;
	const { emojiListPNG } = useEmojiSuggestion();
	const splitText = modified?.split(combinedRegex).filter(Boolean);
	console.log(splitText);
	return (
		<div className="lineText contents gap-1">
			{splitText.map((item, index) => {
				const isMention = item.startsWith('@');
				const isHashtag = item.startsWith('#');
				const isEmojiSyntax = item.match(/:\b[^:]*\b:/g);
				const checkItemIsMarkdown = checkMarkdownInText(item);
				const checkBetweenTripleBacktick = checkTextBetweenTripleBackStick(item);
				console.log(checkItemIsMarkdown);
				console.log(checkBetweenTripleBacktick);
				// console.log('---');
				// console.log(item);
				// console.log(isMention);
				// console.log(isHashtag);
				// console.log(isEmojiSyntax);
				// console.log(checkItemIsMarkdown);

				if (isMention && !isHashtag && !isEmojiSyntax && !checkItemIsMarkdown && !checkBetweenTripleBacktick) {
					return (
						<span key={`mention-${index}`}>
							{splitText[index + 1] === ';' ||
							splitText[index + 1] === '.' ||
							splitText[index + 1] === ',' ||
							splitText[index + 1] === ':' ? (
								<MentionUser tagName={item} />
							) : (
								<>
									<MentionUser tagName={item} />{' '}
								</>
							)}
						</span>
					);
				} else if (!isMention && isHashtag && !isEmojiSyntax && !checkItemIsMarkdown && !checkBetweenTripleBacktick) {
					return (
						<span key={`hashtag-${index}`}>
							{splitText[index + 1] === ';' ||
							splitText[index + 1] === '.' ||
							splitText[index + 1] === ',' ||
							splitText[index + 1] === ':' ? (
								<ChannelHashtag channelHastagId={item} />
							) : (
								<>
									<ChannelHashtag channelHastagId={item} />{' '}
								</>
							)}
						</span>
					);
				} else if (checkItemIsMarkdown && !checkBetweenTripleBacktick) {
					const getLinkinvite = (children: any) => {
						window.location.href = children;
					};

					return (
						<span key={`url-on-text-${index}`}>
							<Markdown
								children={item}
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
							/>{' '}
						</span>
					);
				} else if (checkItemIsMarkdown && checkBetweenTripleBacktick) {
					const getLinkinvite = (children: any) => {
						window.location.href = children;
					};

					return (
						<div key={`url-on-text-${index}`}>
							<Markdown
								children={convertMarkdown(item)}
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
							/>{' '}
						</div>
					);
				} else if (!isMention && !isHashtag && isEmojiSyntax && !checkItemIsMarkdown && !checkBetweenTripleBacktick) {
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
				return <span key={`text-${index}`}>{item} </span>;
			})}
		</div>
	);
};

// const backtickRegex = /`[^`]*`/g;
// const headingRegex = /^(#{1,6}) (.*)/gm;

// const numberedListRegex = /^\d+\.\s/gm;
// const italicRegex = /\*([^*]+)\*/g;
// const boldRegex = /\*\*([^*]+)\*\*/g;
// const boldItalicRegex = /\*\*\*([^*]+)\*\*\*/g;

// const [isMarkdown, setIsMarkdown] = useState<boolean>(false);
// const startsWithTripleBackticks = lineMessage.startsWith('```');
// const endsWithNoTripleBackticks = !lineMessage.endsWith('```');
// const onlyBackticks = /^```$/.test(lineMessage);
// const isQuote = lineMessage.startsWith('>');
// const [convertedLine, setConvertLine] = useState('');
// const [includeHashtagMention, setInCludeHashtagMention] = useState<boolean>(false);
// const mentionRegex = /(?<=(\s|^))(?:@|#)\S+(?=\s|$|\b\d{19}\b)/g;

// useEffect(() => {
// 	if (lineMessage) {
// 		const hasMentionOrHashtag = mentionRegex.test(lineMessage);
// 		setInCludeHashtagMention(hasMentionOrHashtag);
// 	} else {
// 		setInCludeHashtagMention(false);
// 	}
// }, [lineMessage]);

// useEffect(() => {
// 	if (
// 		(startsWithTripleBackticks && endsWithNoTripleBackticks) ||
// 		backtickRegex.test(lineMessage) ||
// 		headingRegex.test(lineMessage) ||
// 		numberedListRegex.test(lineMessage) ||
// 		italicRegex.test(lineMessage) ||
// 		boldRegex.test(lineMessage) ||
// 		boldItalicRegex.test(lineMessage) ||
// 		isQuote
// 	) {
// 		setIsMarkdown(true);
// 		const result = convertMarkdown(lineMessage);
// 		setConvertLine(result);
// 	} else {
// 		setIsMarkdown(false);
// 	}
// }, [lineMessage]);
