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

	return (
		<div className={`contents dark:text-white text-colorTextLightMode ${isJumMessageEnabled ? 'whitespace-nowrap' : ''}`}>
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
			{isMarkDown && typeOfMarkdown === EMarkdownType.SINGLE && <SingleMarkdown content={content ?? ''} isLightMode={isLightMode} />}
			{isMarkDown && typeOfMarkdown === EMarkdownType.TRIPLE && (
				<TripleMarkdown content={content ?? ''} isLightMode={isLightMode} isInPinMsg={isInPinMsg} />
			)}
		</div>
	);
};
export default memo(MarkdownContent);

type PartMarkdownOpt = {
	content?: string;
	isLightMode?: boolean;
	isInPinMsg?: boolean;
};

const SingleMarkdown: React.FC<PartMarkdownOpt> = ({ content, isLightMode }) => {
	return (
		<span className={`prose ${isLightMode ? 'single-markdown-light-mode' : 'single-markdown'} `}>
			<code>{content?.split('`')}</code>
		</span>
	);
};

const TripleMarkdown: React.FC<PartMarkdownOpt> = ({ content, isLightMode, isInPinMsg }) => {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setCopied(false);
		}, 5000);

		return () => clearTimeout(timer);
	}, [copied]);

	return (
		<div className={`triple-markdown ${isInPinMsg ? 'pinned-msg' : ''}`}>
			<pre className={`pre ${isInPinMsg ? 'flex items-start' : ''}`}>
				<CopyToClipboard text={content ?? ''} onCopy={() => setCopied(true)}>
					<button className="icon copy-icon">{copied ? <Icons.PasteIcon /> : <Icons.CopyIcon />}</button>
				</CopyToClipboard>
				<code className={`code ${isInPinMsg ? 'whitespace-pre-wrap block break-words' : ''}`}>{content?.toString()?.split('```')}</code>
			</pre>
		</div>
	);
};
