import { useModal } from 'react-modal-hook';
import { ImagePreview } from '../../ImagePreview';

interface EmbedImageProps {
	url: string;
}

export function EmbedImage({ url }: EmbedImageProps) {
	const [showPreview, closePreview] = useModal(() => {
		return <ImagePreview imageUrl={url} onClose={closePreview} />;
	});

	return (
		<div className="mt-4 rounded overflow-hidden">
			<img src={url} alt="Embed image" className="w-full h-auto max-w-full cursor-pointer" onClick={showPreview} />
		</div>
	);
}
