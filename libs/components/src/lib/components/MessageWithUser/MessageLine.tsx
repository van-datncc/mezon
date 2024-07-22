import { selectTheme } from '@mezon/store';
import clx from 'classnames';
import { memo, useCallback } from 'react';
import Markdown from 'react-markdown';
import { useSelector } from 'react-redux';
import remarkGfm from 'remark-gfm';
import { ChannelHashtag, EmojiMarkdown, MentionUser } from '../../components';
import PreClass from '../MarkdownFormatText/PreClass';

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
	// Combine and sort hashtags and mentions by start_index
	const elements = [...mentions, ...hashtags, ...emojis, ...links, ...markdowns].sort((a, b) => a.start_index - b.start_index);
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
		const { start_index, end_index, channel_id, channel_lable, username, shortname, link, markdown } = element;

		if (lastIndex < start_index) {
			content.push(t.slice(lastIndex, start_index));
		}

		if (channel_id && channel_lable) {
			content.push(<ChannelHashtag key={start_index} channelHastagId={`<#${channel_id}>`} />);
		}
		if (username) {
			content.push(<MentionUser key={start_index} tagName={username} mode={mode} />);
		}
		if (shortname) {
			content.push(<EmojiMarkdown emojiSyntax={shortname} onlyEmoji={false} />);
		}
		if (link) {
			content.push(
				<a
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
				<article style={{ letterSpacing: '-0.01rem' }} className={classes}>
					<div key={index} className="lineText contents dark:text-white text-colorTextLightMode">
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
		lastIndex = end_index;
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
