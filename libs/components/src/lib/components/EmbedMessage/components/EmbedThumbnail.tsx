interface ThumbnailProps {
	url: string;
}

export function EmbedThumbnail({ url }: ThumbnailProps) {
	return (
		<div
			style={{
				position: 'absolute',
				top: '12px',
				right: '16px',
				width: '80px',
				height: '80px',
				borderRadius: '4px',
				overflow: 'hidden'
			}}
		>
			<img
				src={url}
				alt="Thumbnail"
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover'
				}}
			/>
		</div>
	);
}
