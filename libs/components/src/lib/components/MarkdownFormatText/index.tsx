import { ILineMention } from '@mezon/utils';
import Markdown from 'react-markdown';
import remarkGFM from 'remark-gfm';
import PreClass from './PreClass';

type MarkdownFormatTextProps = {
	mentions: ILineMention[];
};

const MarkdownFormatText = ({ mentions }: MarkdownFormatTextProps) => {
	return (
		<article className="flex-wrap whitespace-pre-wrap prose prose-pre:min-w-[500px] prose-sm prose-h1:mb-0 prose-ul:leading-[6px] prose-code:text-[15px] prose-blockquote:leading-[6px] prose-blockquote:mt-3 prose-ol:leading-[6px] prose-p:leading-[20px] prose-li:relative prose-li:bottom-[-5px] flex flex-row gap-1">
			{mentions.map((part, index) => {
				const tagName = part.matchedText;
				const markdown = part.nonMatchText.trim();
				const startsWithTripleBackticks = markdown.startsWith('```');
				const endsWithNoTripleBackticks = !markdown.endsWith('```');
				const onlyBackticks = /^```$/.test(markdown);

				return (
					<div key={index} className="flex flex-row gap-1 lineText">
						{(startsWithTripleBackticks && endsWithNoTripleBackticks) || onlyBackticks ? (
							<span>{markdown}</span>
						) : (
							<Markdown
								children={markdown}
								remarkPlugins={[remarkGFM]}
								components={{
									pre: PreClass,
									p: 'span',
									a: ({ href, children }) => (
										<a
											href={href}
											target="_blank"
											rel="noopener noreferrer"
											style={{ color: 'rgb(59,130,246)' }}
											className="tagLink"
										>
											{children}
										</a>
									),
								}}
							/>
						)}
						{tagName && (
							<span style={{ color: '#3297ff ' }} className="cursor-pointer whitespace-nowrap">
								{tagName}
							</span>
						)}
					</div>
				);
			})}
		</article>
	);
};

export default MarkdownFormatText;
