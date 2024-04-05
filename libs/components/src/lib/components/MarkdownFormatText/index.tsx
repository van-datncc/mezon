import Markdown from 'react-markdown';
import remarkGFM from 'remark-gfm';
import PreClass from './PreClass';

type MarkdownFormatTextProps = {
	markdown: string;
	tagName?: string;
	textFirst?: string;
};

const MarkdownFormatText = ({ markdown, tagName, textFirst }: MarkdownFormatTextProps) => {
	const startsWithTripleBackticks = markdown.startsWith('```');
	const endsWithNoTripleBackticks = !markdown.endsWith('```');
	const onlyBackticks = /^```$/.test(markdown);

	return (
		<article className=" prose prose-pre:min-w-[500px] prose-sm prose-h1:mb-0 prose-ul:leading-[6px] prose-code:text-[15px] prose-blockquote:leading-[6px] prose-blockquote:mt-3 prose-ol:leading-[6px] prose-p:leading-[20px] prose-li:relative prose-li:bottom-[-5px]">
			{textFirst && <span>{textFirst}</span>}
			{tagName && (
				<span style={{ color: '#3297ff' }} className="cursor-pointer">
					{tagName}
				</span>
			)}
			{(startsWithTripleBackticks && endsWithNoTripleBackticks) || onlyBackticks ? (
				<span>{markdown}</span>
			) : (
				<Markdown
					children={markdown}
					remarkPlugins={[remarkGFM]}
					components={{
						pre: PreClass,
						p: 'span',
					}}
				/>
			)}
		</article>
	);
};

export default MarkdownFormatText;
