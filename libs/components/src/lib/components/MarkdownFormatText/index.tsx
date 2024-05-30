import { useApp, useClans, useEmojiSuggestion, useInvite, useOnClickOutside } from '@mezon/core';
import { convertMarkdown, getSrcEmoji } from '@mezon/utils';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { useModal } from 'react-modal-hook';
import remarkGFM from 'remark-gfm';
import ExpiryTimeModal from '../ExpiryTime';
import ShortUserProfile from '../ShortUserProfile/ShortUserProfile';
import ChannelHashtag from './HashTag';
import MentionUser from './MentionUser';
import PreClass from './PreClass';
type MarkdownFormatTextProps = {
	lineMessage: string;
};

const MarkdownFormatText = ({ lineMessage }: MarkdownFormatTextProps) => {
	const [showProfileUser, setIsShowPanelChannel] = useState(false);
	const [userID, setUserID] = useState('');
	const { usersClan } = useClans();

	const handMention = (tagName: string) => {
		setIsShowPanelChannel(true);
		const username = tagName.slice(1);
		const user = usersClan.find((userClan) => userClan.user?.username === username);
		setUserID(user?.user?.id || '');
	};
	const panelRef = useRef<HTMLDivElement | null>(null);
	const [positionBottom, setPositionBottom] = useState(false);
	const [positionTop, setPositionTop] = useState(0);
	const [positionLeft, setPositionLeft] = useState(0);
	const handleMouseClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
		if (event.button === 0) {
			setIsShowPanelChannel(true);
			const clickY = event.clientY;
			const windowHeight = window.innerHeight;
			const distanceToBottom = windowHeight - clickY;
			const windowWidth = window.innerWidth;
			const elementTagName = event.target;
			if (elementTagName instanceof HTMLElement) {
				const positionRight = elementTagName.getBoundingClientRect().right;
				const widthElement = elementTagName.offsetWidth;
				const widthElementShortUserProfileMin = 380;
				const distanceToRight = windowWidth - positionRight;
				if (distanceToRight < widthElementShortUserProfileMin) {
					setPositionLeft(positionRight - widthElement - widthElementShortUserProfileMin);
				} else {
					setPositionLeft(positionRight + 20);
				}
				setPositionTop(clickY - 50);
				setPositionBottom(false);
			}
			const heightElementShortUserProfileMin = 313;
			if (distanceToBottom < heightElementShortUserProfileMin) {
				setPositionBottom(true);
			}
		}
	};

	const handleDefault = (e: any) => {
		e.stopPropagation();
	};

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
	const [isMarkdown, setIsMarkdown] = useState<boolean>(false);
	const startsWithTripleBackticks = lineMessage.startsWith('```');
	const endsWithNoTripleBackticks = !lineMessage.endsWith('```');
	const onlyBackticks = /^```$/.test(lineMessage);
	const [convertedLine, setConvertLine] = useState('');
	useOnClickOutside(panelRef, () => setIsShowPanelChannel(false));

	useEffect(() => {
		if ((startsWithTripleBackticks && endsWithNoTripleBackticks) || backtickRegex.test(lineMessage)) {
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
			{showProfileUser ? (
				<div
					className="dark:bg-black bg-gray-200 mt-[10px] w-[360px] rounded-lg flex flex-col z-10 fixed opacity-100"
					style={{
						left: `${positionLeft}px`,
						top: positionBottom ? '' : `${positionTop}px`,
						bottom: positionBottom ? '64px' : '',
					}}
					onMouseDown={handleDefault}
				>
					<ShortUserProfile userID={userID} />
				</div>
			) : null}

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
								className={` w-5 h-5 inline align-middle m-0`}
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
