import { IEmbedProps } from '@mezon/utils';
import { EmbedAuthor } from './components/EmbedAuthor';
import { EmbedDescription } from './components/EmbedDescription';
import { EmbedFields } from './components/EmbedFields';
import { EmbedFooter } from './components/EmbedFooter';
import { EmbedImage } from './components/EmbedImage';
import { EmbedThumbnail } from './components/EmbedThumbnail';
import { EmbedTitle } from './components/EmbedTitle';

export default function EmbedMessage(embed: IEmbedProps) {
	const { color, title, url, author, description, fields = [], image, timestamp, footer, thumbnail } = embed;

	return (
		<div className="max-w-[520px] bg-gray-800 rounded-lg overflow-hidden text-left relative my-3">
			<div className="flex flex-col px-5">
				<div className={`absolute left-0 top-0 h-full w-1 bg-[${color}]`} />
				{author && <EmbedAuthor {...author} />}
				{title && <EmbedTitle title={title} url={url} />}
				{description && <EmbedDescription description={description} />}
				{fields && <EmbedFields fields={fields} />}
				{image && <EmbedImage url={image.url} />}
				{(footer || timestamp) && <EmbedFooter {...footer} timestamp={timestamp} />}
				{thumbnail && <EmbedThumbnail url={thumbnail.url} />}
			</div>
		</div>
	);
}
