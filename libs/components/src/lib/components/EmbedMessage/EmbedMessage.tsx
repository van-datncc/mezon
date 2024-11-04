import { EmbedAuthor } from './components/EmbedAuthor';
import { EmbedDescription } from './components/EmbedDescription';
import { EmbedFields } from './components/EmbedFields';
import { EmbedFooter } from './components/EmbedFooter';
import { EmbedImage } from './components/EmbedImage';
import { EmbedTitle } from './components/EmbedTitle';

interface EmbedProps {
	color?: string;
	title?: string;
	url?: string;
	author?: {
		name: string;
		icon_url?: string;
		url?: string;
	};
	description?: string;
	thumbnail?: { url: string };
	fields?: Array<{ name: string; value: string; inline?: boolean }>;
	image?: { url: string };
	timestamp?: string;
	footer?: { text: string; icon_url?: string };
}

export default function EmbedMessage({ color, title, url, author, description, fields = [], image, timestamp, footer }: EmbedProps) {
	return (
		<div className="max-w-[520px] bg-gray-800 rounded-lg overflow-hidden text-left relative">
			<div className="flex flex-col p-5">
				<div className={`absolute left-0 top-0 h-full w-1 bg-[${color}]`} />
				{author && <EmbedAuthor {...author} />}
				{title && <EmbedTitle title={title} url={url} />}
				{description && <EmbedDescription description={description} />}
				<EmbedFields fields={fields} />
				{image && <EmbedImage url={image.url} />}
				{(footer || timestamp) && <EmbedFooter {...footer} timestamp={timestamp} />}
			</div>
		</div>
	);
}
