interface EmbedImageProps {
	url: string;
}

export function EmbedImage({ url }: EmbedImageProps) {
	return (
		<div className="mt-4 rounded overflow-hidden">
			<img src={url} alt="Embed image" className="w-full h-auto max-w-full" />
		</div>
	);
}
