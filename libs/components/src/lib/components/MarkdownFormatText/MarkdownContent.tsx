import { useAppNavigation } from '@mezon/core';
import { inviteActions, selectTheme, useAppDispatch } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { EMarkdownType } from '@mezon/utils';
import { memo, useCallback, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useSelector } from 'react-redux';

type MarkdownContentOpt = {
	content?: string;
	isJumMessageEnabled: boolean;
	isTokenClickAble: boolean;
	isInPinMsg?: boolean;
	isLink?: boolean;
	isMarkDown?: boolean;
	typeOfMarkdown?: EMarkdownType;
};

export const MarkdownContent: React.FC<MarkdownContentOpt> = ({
	content,
	isJumMessageEnabled,
	isTokenClickAble,
	isInPinMsg,
	isLink,
	isMarkDown,
	typeOfMarkdown
}) => {
	const appearanceTheme = useSelector(selectTheme);
	const { navigate } = useAppNavigation();
	const dispatch = useAppDispatch();
	const origin = process.env.NX_CHAT_APP_REDIRECT_URI + '/invite/';
	const onClickLink = useCallback(
		(url: string) => {
			if (!isJumMessageEnabled || isTokenClickAble) {
				if (url.startsWith(origin)) {
					const urlInvite = new URL(url);
					dispatch(inviteActions.setIsClickInvite(true));
					navigate(urlInvite.pathname);
				} else {
					window.open(url, '_blank');
				}
			}
		},
		[isJumMessageEnabled, isTokenClickAble]
	);

	const isLightMode = appearanceTheme === 'light';
	const posInNotification = !isJumMessageEnabled && !isTokenClickAble;
	const posInReply = isJumMessageEnabled && !isTokenClickAble;

	return (
		<div className={` dark:text-white text-colorTextLightMode ${isJumMessageEnabled ? 'whitespace-nowrap' : ''}`}>
			{isLink && (
				// eslint-disable-next-line jsx-a11y/anchor-is-valid
				<a
					onClick={() => onClickLink(content ?? '')}
					rel="noopener noreferrer"
					style={{
						color: 'rgb(59,130,246)',
						cursor: isJumMessageEnabled || !isTokenClickAble ? 'text' : 'pointer',
						wordBreak: 'break-word',
						textDecoration: isJumMessageEnabled || !isTokenClickAble ? 'none' : 'underline'
					}}
					className="tagLink"
				>
					{content}
				</a>
			)}
			{isMarkDown && typeOfMarkdown === EMarkdownType.SINGLE ? (
				<SingleBacktick content={content?.split('`').filter(Boolean)} isInPinMsg={isInPinMsg} isLightMode={isLightMode} />
			) : isMarkDown && typeOfMarkdown === EMarkdownType.TRIPLE && !posInReply ? (
				<TripleBackticks content={content ?? ''} isLightMode={isLightMode} isInPinMsg={isInPinMsg} />
			) : typeOfMarkdown === EMarkdownType.TRIPLE && posInReply ? (
				<SingleBacktick content={content?.split('`').filter(Boolean)} isLightMode={isLightMode} />
			) : null}
		</div>
	);
};
export default memo(MarkdownContent);

type BacktickOpt = {
	content?: any;
	isLightMode?: boolean;
	isInPinMsg?: boolean;
	isJumMessageEnabled?: boolean;
	posInNotification?: boolean;
};

const SingleBacktick: React.FC<BacktickOpt> = ({ content, isLightMode, posInNotification, isInPinMsg }) => {
	return (
		<span className={`prose ${isLightMode ? 'single-markdown-light-mode' : 'single-markdown'} `}>
			<code
				className={`${isInPinMsg && isLightMode ? 'whitespace-pre-wrap block break-words pin-msg-modeLight' : isInPinMsg && !isLightMode ? 'whitespace-pre-wrap block break-words pin-msg' : null}`}
			>
				{content}
			</code>
		</span>
	);
};

const TripleBackticks: React.FC<BacktickOpt> = ({ content, isLightMode, isInPinMsg }) => {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setCopied(false);
		}, 5000);

		return () => clearTimeout(timer);
	}, [copied]);

	const splitContent = content?.split('```').filter(Boolean);

	return (
		<div className={`prose ${isLightMode ? 'triple-markdown-lightMode' : 'triple-markdown'} `}>
			<pre className={`relative p-2 ${isInPinMsg ? `flex items-start  ${isLightMode ? 'pin-msg-modeLight' : 'pin-msg'}` : ''}`}>
				<CopyToClipboard text={content ?? ''} onCopy={() => setCopied(true)}>
					<button className={`absolute right-3 top-3 ${isLightMode ? 'text-[#535353]' : 'text-[#E5E7EB]'} `}>
						{copied ? <Icons.PasteIcon /> : <Icons.CopyIcon />}
					</button>
				</CopyToClipboard>
				{splitContent?.map((block: string) => (
					<code className={`${isInPinMsg ? 'whitespace-pre-wrap block break-words' : ''}`}>{block.trim()}</code>
				))}
			</pre>
		</div>
	);
};
