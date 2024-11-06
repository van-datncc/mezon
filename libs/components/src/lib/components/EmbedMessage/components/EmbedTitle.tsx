interface EmbedTitleProps {
	title: string;
	url?: string;
}

export function EmbedTitle({ title, url }: EmbedTitleProps) {
	return (
		<div className="mt-2">
			{url ? (
				<a href={url} className="text-[#00aff4] font-semibold no-underline" target={'_blank'} rel="noreferrer">
					{title}
				</a>
			) : (
				<span className="text-[#00aff4] font-semibold">{title}</span>
			)}
		</div>
	);
}
