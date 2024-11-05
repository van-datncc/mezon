interface ThumbnailProps {
	url: string;
}

export function EmbedThumbnail({ url }: ThumbnailProps) {
	return (
		<div className="absolute top-3 right-4 w-20 h-20 rounded overflow-hidden">
			<img src={url} alt="Thumbnail" className="w-full h-full object-cover" />
		</div>
	);
}
