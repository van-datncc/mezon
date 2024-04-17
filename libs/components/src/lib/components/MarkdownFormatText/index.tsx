import { useClans, useOnClickOutside } from '@mezon/core';
import { ILineMention } from '@mezon/utils';
import { useRef, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGFM from 'remark-gfm';
import ShortUserProfile from '../ShortUserProfile/ShortUserProfile';
import PreClass from './PreClass';
type MarkdownFormatTextProps = {
	mentions: ILineMention[];
};

const MarkdownFormatText = ({ mentions }: MarkdownFormatTextProps) => {
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
	const handleMouseClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
		if (event.button === 0) {
			setIsShowPanelChannel(true);
		}
	};
	useOnClickOutside(panelRef, () => setIsShowPanelChannel(false));

	return (
		<article
			className="prose-code:text-sm prose-hr:my-0 prose-headings:my-0 prose-headings:contents prose-h1:prose-2xl whitespace-pre-wrap prose prose-sm prose-blockquote:leading-[6px] prose-blockquote:my-0"
			ref={panelRef}
			onMouseDown={(event) => handleMouseClick(event)}
		>
			{showProfileUser ? (
				<div className="bg-black mt-[10px] w-[360px] rounded-lg flex flex-col z-10 absolute top-[-500px] right-[200px] opacity-100">
					<ShortUserProfile userID={userID} />
				</div>
			) : null}
			{mentions.map((part, index) => {
				const tagName = part.matchedText;
				const markdown = part.nonMatchText.trim();
				const startsWithTripleBackticks = markdown.startsWith('```');
				const endsWithNoTripleBackticks = !markdown.endsWith('```');
				const onlyBackticks = /^```$/.test(markdown);

				return (
					<div key={index} className="lineText contents">
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
						{markdown && ' '}
						{tagName && (
							<span
								style={{ borderRadius: '4px', padding: '0 2px' }}
								className="cursor-pointer whitespace-nowrap !text-[#3297ff] hover:!text-white bg-[#3C4270] hover:bg-[#5865F2]"
								onClick={() => handMention(tagName)}
							>
								{tagName}
							</span>
						)}{' '}
					</div>
				);
			})}
		</article>
	);
};

export default MarkdownFormatText;
