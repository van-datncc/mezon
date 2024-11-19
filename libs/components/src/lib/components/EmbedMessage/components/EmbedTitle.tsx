interface EmbedTitleProps {
	title: string;
	url?: string;
}

export function EmbedTitle({ title, url }: EmbedTitleProps) {
	return (
		<div className="mt-2 h-fit">
			{url ? (
				<a
					href={url}
					className="font-semibold no-underline text-contentBrandLight hover:underline cursor-pointer"
					target={'_blank'}
					rel="noreferrer"
				>
					{title}
				</a>
			) : (
				<span className="font-semibold">{title}</span>
			)}
		</div>
	);
}
