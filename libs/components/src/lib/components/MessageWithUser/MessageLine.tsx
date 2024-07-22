import { selectTheme } from '@mezon/store';
import clx from 'classnames';
import { memo, useCallback } from 'react';
import Markdown from 'react-markdown';
import { useSelector } from 'react-redux';
import remarkGfm from 'remark-gfm';
import { ChannelHashtag, EmojiMarkup, MentionUser, PreClass } from '../../components';

type MessageLineProps = {
	line: string;
	messageId?: string;
	mode?: number;
	content?: any;
};

// TODO: refactor component for message lines
const RenderContent = ({ data }: any, mode: number) => {
	const appearanceTheme = useSelector(selectTheme);
	const { t, mentions = [], hashtags = [], emojis = [], links = [], markdowns = [] } = data;
	const elements = [...mentions, ...hashtags, ...emojis, ...links, ...markdowns].sort((a, b) => a.startIndex - b.startIndex);
	let lastIndex = 0;
	const content = [];

	const onClickLink = useCallback((url: string) => {
		window.open(url, '_blank');
	}, []);

	const classes = clx(
		'prose-code:text-sm prose-hr:my-0 prose-headings:my-0 prose-h1-2xl whitespace-pre-wrap prose   prose-blockquote:my-0 leading-[0] ',

		{
			lightMode: appearanceTheme === 'light',
		},
	);

	elements.forEach((element, index) => {
		const { startIndex, endIndex, channelId, channelLable, username, shortname, link, markdown } = element;

		if (lastIndex < startIndex) {
			content.push(t.slice(lastIndex, startIndex));
		}

		if (channelId && channelLable) {
			content.push(<ChannelHashtag key={`${index}${startIndex}${channelId}`} channelHastagId={`<#${channelId}>`} />);
		}
		if (username) {
			content.push(<MentionUser key={`${index}${startIndex}${username}`} tagName={username} mode={mode} />);
		}
		if (shortname) {
			content.push(<EmojiMarkup key={`${index}${startIndex}${shortname}`} emojiSyntax={shortname} onlyEmoji={false} />);
		}
		if (link) {
			content.push(
				<a
					key={`${index}${startIndex}${link}`}
					style={{ color: 'rgb(59,130,246)', cursor: 'pointer' }}
					className=" hover: underline"
					href={link}
					rel="noopener noreferrer"
					target="_blank"
				>
					{link}
				</a>,
			);
		}
		if (markdown) {
			content.push(
				<article key={`${index}${startIndex}${markdown}`} style={{ letterSpacing: '-0.01rem' }} className={classes}>
					<div className="lineText contents dark:text-white text-colorTextLightMode">
						<Markdown
							children={markdown}
							remarkPlugins={[remarkGfm]}
							components={{
								pre: PreClass,
								p: 'span',
								a: (props) => (
									<span
										onClick={() => onClickLink(props.href ?? '')}
										rel="noopener noreferrer"
										style={{ color: 'rgb(59,130,246)', cursor: 'pointer' }}
										className="tagLink"
									>
										{props.children}
									</span>
								),
							}}
						/>
					</div>
				</article>,
			);
		}
		lastIndex = endIndex;
	});

	if (lastIndex < t.length) {
		content.push(t.slice(lastIndex));
	}
	return <div>{content}</div>;
};

const MessageLine = ({ line, messageId, mode, content }: MessageLineProps) => {
	return (
		<div>
			<RenderContent data={content} mode={mode} />
		</div>
	);
};

export default memo(MessageLine);
