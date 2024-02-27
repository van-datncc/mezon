import { Img, ImgProps } from 'react-image';

export type ImageProps = ImgProps & {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	placeholder?: string;
	blurDataURL?: string;
};

function Image(params: ImageProps) {
	return (
		<Img {...params} />		
	);
}

export default Image;
