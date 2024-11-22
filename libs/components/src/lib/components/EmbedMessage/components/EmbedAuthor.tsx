interface EmbedAuthorProps {
	name: string;
	icon_url?: string;
	url?: string;
}

export function EmbedAuthor({ name, icon_url, url }: EmbedAuthorProps) {
	return (
		<div className="flex items-center gap-2 mt-2">
			{icon_url && <img src={icon_url} alt={name} className="w-6 h-6 rounded-full object-cover" />}
			{url ? (
				<a href={url} className="text-sm font-medium no-underline hover:underline" target={'_blank'} rel="noreferrer">
					{name}
				</a>
			) : (
				<span className="text-sm font-medium">{name}</span>
			)}
		</div>
	);
}
