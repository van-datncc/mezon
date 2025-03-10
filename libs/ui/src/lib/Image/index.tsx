export type ImageProps = {
	src: string;
	alt?: string;
	width?: number;
	height?: number;
	placeholder?: string;
	blurdataurl?: string;
	loading?: 'lazy' | 'eager';
	onClick?: () => void;
	className?: string;
	draggable?: 'true' | 'false';
};

function Image({ loading = 'lazy', src, alt = src, className, draggable, ...rest }: ImageProps) {
	return <img {...rest} src={src} alt={alt} loading={loading} className={className} draggable={draggable} />;
}

export default Image;
