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
		<div className="max-w-[400px] w-fit dark:bg-bgSecondary bg-bgLightSecondary rounded-lg overflow-hidden text-left relative my-3 text-textLightTheme dark:text-textDarkTheme">
			<div className="flex flex-col px-5">
				<div className={`absolute left-0 top-0 h-full w-1`} style={{ backgroundColor: color }} />
				<div className={'flex flex-row justify-between'}>
					<div className={'flex flex-col pr-2'}>
						{author && <EmbedAuthor {...author} />}
						{title && <EmbedTitle title={title} url={url} />}
						{description && <EmbedDescription description={description} />}
						{fields && <EmbedFields fields={fields} />}
					</div>
					<div className={'w-16'}>{thumbnail && <EmbedThumbnail url={thumbnail.url} />}</div>
				</div>

				{image && <EmbedImage url={image.url} />}
				{(footer || timestamp) && <EmbedFooter {...footer} timestamp={timestamp} />}
			</div>
		</div>
	);
}

export const mockEmbed = {
	color: '#5eeb34',
	title: 'Welcome to Our Discord Server!',
	url: 'https://discord.js.org',
	author: {
		name: 'Author name',
		icon_url: 'https://i.imgur.com/AfFp7pu.png',
		url: 'https://discord.js.org'
	},
	description: 'This is the description of this embed message',
	thumbnail: {
		url: 'https://i.imgur.com/AfFp7pu.png'
	},
	fields: [
		{
			name: 'Regular field title',
			value: 'This is a regular field with some value text.'
		},
		{
			name: 'Inline field 1',
			value: 'This is an inline field.',
			inline: true
		},
		{
			name: 'Inline field 2',
			value: 'This is another inline field.',
			inline: true
		},
		{
			name: 'Inline field 3',
			value: 'This is a third inline field.',
			inline: true
		},
		{
			name: 'Inline field 4',
			value: 'This is a third inline field.',
			inline: true
		},
		{
			name: 'Inline field 5',
			value: 'This is a third inline field.',
			inline: true
		}
	],
	image: {
		url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/800px-Unofficial_JavaScript_logo_2.svg.png'
	},
	timestamp: new Date().toISOString(),
	footer: {
		text: 'Sample footer text',
		icon_url: 'https://i.imgur.com/AfFp7pu.png'
	}
};
