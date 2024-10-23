import { useAppNavigation } from '@mezon/core';
import { inviteActions, selectTheme, useAppDispatch } from '@mezon/store';
import { EMarkdownType } from '@mezon/utils';
import clx from 'classnames';
import { memo, useCallback } from 'react';
import Markdown from 'react-markdown';
import { useSelector } from 'react-redux';
import { PreClass } from '../../components';

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

	const classes = clx(
		'prose-code:text-sm inline prose-hr:my-0 prose-headings:my-0 prose-h1-2xl whitespace-pre-wrap prose   prose-blockquote:my-0 leading-[0] ',
		{
			lightMode: appearanceTheme === 'light'
		}
	);
	return (
		<article style={{ letterSpacing: '-0.01rem' }} className={classes}>
			<div className={`lineText contents dark:text-white text-colorTextLightMode ${isJumMessageEnabled ? 'whitespace-nowrap' : ''}`}>
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
				{isMarkDown && typeOfMarkdown === EMarkdownType.SINGLE && (
					<Markdown
						children={content}
						components={{
							p: 'span'
						}}
					/>
				)}
				{isMarkDown && typeOfMarkdown === EMarkdownType.TRIPLE && (
					<Markdown
						children={content}
						components={{
							pre: (props) => <PreClass {...props} isInPinMsg={isInPinMsg} />
						}}
					/>
				)}
			</div>
		</article>
	);
};
export default memo(MarkdownContent);
