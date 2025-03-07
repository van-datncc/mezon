import { useEffect, useState } from 'react';
import { Img, ImgProps } from 'react-image';

export type ImageProps = ImgProps & {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	placeholder?: string;
	blurdataurl?: string;
};

function Image({ loading = 'lazy', ...rest }: ImageProps) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		return () => setIsMounted(false);
	}, []);

	if (!isMounted) return null;

	return <Img {...rest} loading={loading} />;
}

export default Image;
