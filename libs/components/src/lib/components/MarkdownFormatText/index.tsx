import Markdown from 'react-markdown';
import remarkGFM from 'remark-gfm';
import { ILineMention } from '../MessageWithUser/useMessageLine';
import PreClass from './PreClass';

type MarkdownFormatTextProps = {
	mentions: ILineMention[];
};

const MarkdownFormatText = ({ mentions }: MarkdownFormatTextProps) => {
	return (
		<article className=" prose prose-pre:min-w-[500px] prose-sm prose-h1:mb-0 prose-ul:leading-[6px] prose-code:text-[15px] prose-blockquote:leading-[6px] prose-blockquote:mt-3 prose-ol:leading-[6px] prose-p:leading-[20px] prose-li:relative prose-li:bottom-[-5px]">
			{mentions.map((part, index) => {
				const tagName = part.matchedText;
				const markdown = part.nonMatchText.trim();
				const startsWithTripleBackticks = markdown.startsWith('```');
				const endsWithNoTripleBackticks = !markdown.endsWith('```');
				const onlyBackticks = /^```$/.test(markdown);
				return (
					<span key={index}>
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
						{tagName && (
							<span style={{ color: '#3297ff' }} className="cursor-pointer">
								{tagName}
							</span>
						)}
					</span>
				);
			})}
		</article>
	);
};

export default MarkdownFormatText;
