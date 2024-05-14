interface IconProps {
	defaultFill?: string;
	defaultSize?: string;
}
export const ClockHistory: React.FC<IconProps> = ({ defaultFill = '#AEAEAE', defaultSize = 'w-5 h-5' }) => {
	return (
		<svg
			className={defaultSize}
			aria-hidden="true"
			role="img"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			fill="none"
			viewBox="0 0 24 24"
		>
			<path
				fill={defaultFill}
				fillRule="evenodd"
				d="M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22Zm1-18a1 1 0 1 0-2 0v7c0 .27.1.52.3.7l3 3a1 1 0 0 0 1.4-1.4L13 11.58V5Z"
				clipRule="evenodd"
				className={defaultSize}
			></path>
		</svg>
	);
};
