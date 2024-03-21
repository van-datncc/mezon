import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownFormatTextProps = {
	markdown: string;
};

const MarkdownFormatText = ({ markdown }: MarkdownFormatTextProps) => {
	return <Markdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]} children={markdown} className={`prose`} />;
};

export default MarkdownFormatText;
