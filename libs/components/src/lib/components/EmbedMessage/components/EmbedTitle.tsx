interface EmbedTitleProps {
	title: string;
	url?: string;
}

export function EmbedTitle({ title, url }: EmbedTitleProps) {
	return (
		<div className="mt-2">
			{url ? (
				<a href={url} className="font-semibold no-underline" target={'_blank'} rel="noreferrer">
					{title}
				</a>
			) : (
				<span className=" font-semibold">{title}</span>
			)}
		</div>
	);
}
