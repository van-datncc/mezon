interface IconProps {
	defaultFill?: string;
	defaultSize?: string;
}
export const ReplyRightClick: React.FC<IconProps> = ({ defaultFill = '#AEAEAE', defaultSize = 'w-4 h-4' }) => {
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
				fill="currentColor"
				d="M2.3 7.3a1 1 0 0 0 0 1.4l5 5a1 1 0 0 0 1.4-1.4L5.42 9H11a7 7 0 0 1 7 7v4a1 1 0 1 0 2 0v-4a9 9 0 0 0-9-9H5.41l3.3-3.3a1 1 0 0 0-1.42-1.4l-5 5Z"
				className=""
			></path>
		</svg>
	);
};

export const CopyTextRightClick: React.FC<IconProps> = ({ defaultFill = '#AEAEAE', defaultSize = 'w-4 h-4' }) => {
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
				fill="currentColor"
				d="M3 16a1 1 0 0 1-1-1v-5a8 8 0 0 1 8-8h5a1 1 0 0 1 1 1v.5a.5.5 0 0 1-.5.5H10a6 6 0 0 0-6 6v5.5a.5.5 0 0 1-.5.5H3Z"
				className=""
			></path>
			<path fill="currentColor" d="M6 18a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-4h-3a5 5 0 0 1-5-5V6h-4a4 4 0 0 0-4 4v8Z" className=""></path>
			<path fill="currentColor" d="M21.73 12a3 3 0 0 0-.6-.88l-4.25-4.24a3 3 0 0 0-.88-.61V9a3 3 0 0 0 3 3h2.73Z" className=""></path>
		</svg>
	);
};

export const UnreadRightClick: React.FC<IconProps> = ({ defaultFill = '#AEAEAE', defaultSize = 'w-4 h-4' }) => {
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
				d="M12.93 21.96c.25-.03.43-.23.47-.47a3 3 0 0 1 .08-.35.66.66 0 0 0-.24-.71A3 3 0 0 1 12 18v-3a3 3 0 0 1 4.35-2.68c.14.07.3.09.44.04a7 7 0 0 1 4.58.05c.3.1.63-.1.63-.41a10 10 0 1 0-18.45 5.36c.13.19.11.44-.04.61l-2.06 2.37A1 1 0 0 0 2.2 22H12c.32 0 .63-.01.93-.04Z"
				fill="currentColor"
				className=""
			></path>
			<path
				d="M18 17h-1.24a3 3 0 1 1 .26 4.25 1 1 0 1 0-1.33 1.5A4.98 4.98 0 0 0 24 19a5 5 0 0 0-8-4 1 1 0 0 0-2 0v3a1 1 0 0 0 1 1h3a1 1 0 1 0 0-2Z"
				fill="currentColor"
				className=""
			></path>
		</svg>
	);
};

export const CopyMessageLinkRightClick: React.FC<IconProps> = ({ defaultFill = '#AEAEAE', defaultSize = 'w-4 h-4' }) => {
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
				fill="currentColor"
				d="M16.3 14.7a1 1 0 0 1 0-1.4l2.5-2.5a3.95 3.95 0 1 0-5.6-5.6l-2.5 2.5a1 1 0 1 1-1.4-1.4l2.5-2.5a5.95 5.95 0 1 1 8.4 8.4l-2.5 2.5a1 1 0 0 1-1.4 0ZM7.7 9.3a1 1 0 0 1 0 1.4l-2.5 2.5a3.95 3.95 0 0 0 5.6 5.6l2.5-2.5a1 1 0 1 1 1.4 1.4l-2.5 2.5a5.95 5.95 0 0 1-8.4-8.4l2.5-2.5a1 1 0 0 1 1.4 0Z"
				className=""
			></path>
			<path fill="currentColor" d="M14.7 10.7a1 1 0 1 0-1.4-1.4l-4 4a1 1 0 0 0 1.4 1.4l4-4Z" className=""></path>
		</svg>
	);
};

export const SpeakMessageRightClick: React.FC<IconProps> = ({ defaultFill = '#AEAEAE', defaultSize = 'w-4 h-4' }) => {
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
				fill="currentColor"
				fillRule="evenodd"
				d="M12 22a10 10 0 1 0-8.45-4.64c.13.19.11.44-.04.61l-2.06 2.37A1 1 0 0 0 2.2 22H12Zm2-5.26c0 .61.56 1.09 1.14.87a6 6 0 0 0 0-11.22c-.58-.22-1.14.26-1.14.87v.1c0 .45.32.83.73 1.03a4 4 0 0 1 0 7.22c-.41.2-.73.58-.73 1.04v.09Zm0-3.32c0 .69.7 1.15 1.18.65a2.99 2.99 0 0 0 0-4.14c-.48-.5-1.18-.04-1.18.65v2.84ZM12 7a1 1 0 0 0-1-1h-.05a1 1 0 0 0-.75.34L7.87 9H6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1.87l2.33 2.66a1 1 0 0 0 .75.34H11a1 1 0 0 0 1-1V7Z"
				clipRule="evenodd"
				className=""
			></path>
		</svg>
	);
};

export const PinMessageRightClick: React.FC<IconProps> = ({ defaultFill = '#AEAEAE', defaultSize = 'w-4 h-4' }) => {
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
				fill="currentColor"
				d="M19.38 11.38a3 3 0 0 0 4.24 0l.03-.03a.5.5 0 0 0 0-.7L13.35.35a.5.5 0 0 0-.7 0l-.03.03a3 3 0 0 0 0 4.24L13 5l-2.92 2.92-3.65-.34a2 2 0 0 0-1.6.58l-.62.63a1 1 0 0 0 0 1.42l9.58 9.58a1 1 0 0 0 1.42 0l.63-.63a2 2 0 0 0 .58-1.6l-.34-3.64L19 11l.38.38ZM9.07 17.07a.5.5 0 0 1-.08.77l-5.15 3.43a.5.5 0 0 1-.63-.06l-.42-.42a.5.5 0 0 1-.06-.63L6.16 15a.5.5 0 0 1 .77-.08l2.14 2.14Z"
				className=""
			></path>
		</svg>
	);
};

export const EditMessageRightClick: React.FC<IconProps> = ({ defaultFill = '#AEAEAE', defaultSize = 'w-4 h-4' }) => {
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
				fill="currentColor"
				d="m13.96 5.46 4.58 4.58a1 1 0 0 0 1.42 0l1.38-1.38a2 2 0 0 0 0-2.82l-3.18-3.18a2 2 0 0 0-2.82 0l-1.38 1.38a1 1 0 0 0 0 1.42ZM2.11 20.16l.73-4.22a3 3 0 0 1 .83-1.61l7.87-7.87a1 1 0 0 1 1.42 0l4.58 4.58a1 1 0 0 1 0 1.42l-7.87 7.87a3 3 0 0 1-1.6.83l-4.23.73a1.5 1.5 0 0 1-1.73-1.73Z"
				className=""
			></path>
		</svg>
	);
};

export const DeleteMessageRightClick: React.FC<IconProps> = ({ defaultFill = '#AEAEAE', defaultSize = 'w-4 h-4' }) => {
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
				fill="currentColor"
				d="M14.25 1c.41 0 .75.34.75.75V3h5.25c.41 0 .75.34.75.75v.5c0 .41-.34.75-.75.75H3.75A.75.75 0 0 1 3 4.25v-.5c0-.41.34-.75.75-.75H9V1.75c0-.41.34-.75.75-.75h4.5Z"
				className=""
			></path>
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="M5.06 7a1 1 0 0 0-1 1.06l.76 12.13a3 3 0 0 0 3 2.81h8.36a3 3 0 0 0 3-2.81l.75-12.13a1 1 0 0 0-1-1.06H5.07ZM11 12a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0v-6Zm3-1a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Z"
				clipRule="evenodd"
				className=""
			></path>
		</svg>
	);
};

export const RightArrowRightClick: React.FC<IconProps> = ({ defaultFill = '#AEAEAE', defaultSize = 'w-4 h-4' }) => {
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
				fill="currentColor"
				d="M9.3 5.3a1 1 0 0 0 0 1.4l5.29 5.3-5.3 5.3a1 1 0 1 0 1.42 1.4l6-6a1 1 0 0 0 0-1.4l-6-6a1 1 0 0 0-1.42 0Z"
				className=""
			></path>
		</svg>
	);
};

export const ViewReactionRightClick: React.FC<IconProps> = ({ defaultFill = '#AEAEAE', defaultSize = 'w-4 h-4' }) => {
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
				fill="currentColor"
				fillRule="evenodd"
				d="M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22ZM6.5 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm-9.8 1.17a1 1 0 0 1 1.39.27 3.5 3.5 0 0 0 5.82 0 1 1 0 0 1 1.66 1.12 5.5 5.5 0 0 1-9.14 0 1 1 0 0 1 .27-1.4Z"
				clipRule="evenodd"
				className=""
			></path>
		</svg>
	);
};

export const ReportMessageRightClick: React.FC<IconProps> = ({ defaultFill = '#AEAEAE', defaultSize = 'w-4 h-4' }) => {
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
				fill="currentColor"
				d="M3 1a1 1 0 0 1 1 1v.82l8.67-1.45A2 2 0 0 1 15 3.35v1.47l5.67-.95A2 2 0 0 1 23 5.85v7.3a2 2 0 0 1-1.67 1.98l-9 1.5a2 2 0 0 1-1.78-.6c-.2-.21-.08-.54.18-.68a5.01 5.01 0 0 0 1.94-1.94c.18-.32-.1-.66-.46-.6L4 14.18V21a1 1 0 1 1-2 0V2a1 1 0 0 1 1-1Z"
				className=""
			></path>
		</svg>
	);
};

export const CanvasIconRightClick: React.FC<IconProps> = ({ defaultFill = '#AEAEAE', defaultSize = 'w-4 h-4' }) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24" className={defaultSize}>
			<path
				d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h10l6-6V5C21,3.895,20.105,3,19,3z M8,7h8c0.552,0,1,0.448,1,1v0 c0,0.552-0.448,1-1,1H8C7.448,9,7,8.552,7,8v0C7,7.448,7.448,7,8,7z M11,13H8c-0.552,0-1-0.448-1-1v0c0-0.552,0.448-1,1-1h3 c0.552,0,1,0.448,1,1v0C12,12.552,11.552,13,11,13z M14,19.5V14h5.5L14,19.5z"
				fill="currentColor"
			></path>
		</svg>
	);
};

export const DollarIconRightClick: React.FC<IconProps> = ({ defaultFill = '#AEAEAE', defaultSize = 'w-4 h-4' }) => {
	return (
		<svg
			height="800px"
			width="800px"
			version="1.1"
			id="Layer_1"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			viewBox="0 0 64 64"
			enableBackground="new 0 0 64 64"
			xmlSpace="preserve"
			className={defaultSize}
		>
			<g id="US-coin">
				<path
					fill="currentColor"
					d="M33.0004005,27.4897995v-11.846199c2.209198,0.1276999,3.8346977,0.6910992,4.7324066,1.6488991
		c0.8134918,0.8691006,0.7743912,1.7933998,0.771492,1.8554001c-0.0458984,0.5445004,0.3555107,1.0263996,0.9004021,1.078701
		c0.5517998,0.0438995,1.0381088-0.3501015,1.0907974-0.9004002c0.017601-0.1822014,0.1309013-1.8233013-1.25-3.3428001
		c-1.2817993-1.4107008-3.3841972-2.1916008-6.2450981-2.3376007V10c0-0.5522003-0.4473-1-1-1s-1,0.4477997-1,1v3.6475
		c-7.8845921,0.3302002-9,4.5334997-9,8.6601c0,4.5676003,2.9512005,6.9036999,9,7.1313v13.3871002
		c-2.9852009-0.1097984-7-0.7792015-7-3.5955009c0-0.5527992-0.4473-1-1-1s-1,0.4472008-1,1
		c0,2.0119019,1.2152996,5.3241005,9,5.5893021V50c0,0.5527,0.4473,1,1,1s1-0.4473,1-1v-5.1848984
		c5.8116989-0.3094025,9-3.3544998,9-8.6618004C42.0004005,30.6847,38.9703979,27.7770004,33.0004005,27.4897995z
		 M31.0004005,27.4375c-6.1312008-0.2409992-7-2.7087994-7-5.1299c0-3.3582001,0.5688992-6.3823996,7-6.6645002V27.4375z
		 M33.0004005,42.8162003V29.4857006c3.4489975,0.1543999,7,1.2619991,7,6.6676006
		C40.0004005,40.3054008,37.6459999,42.5429993,33.0004005,42.8162003z"
				/>
				<path
					fill="currentColor"
					d="M51.581501,45.0996017c-0.4961014-0.3203011-1.1592026-0.1777-1.4815025,0.3192978
		c-4.3554993,6.75-9.1483994,7.5059013-9.2372971,7.5186005c-0.5840034,0.0751991-0.9980011,0.6083984-0.9258003,1.1934013
		c0.0663986,0.5429001,0.5282974,0.9403992,1.0625,0.9403992c0.0429993,0,0.0878983-0.0019989,0.131897-0.0078011
		c0.235302-0.0283012,5.8095093-0.7958984,10.7695122-8.482399C52.2220993,46.0839996,52.0784988,45.4208984,51.581501,45.0996017z"
				/>
				<path
					fill="currentColor"
					d="M32,0c-17.6730995,0-32,14.3268995-32,32s14.3268995,32,32,32c17.6731987,0,32-14.3269005,32-32S49.6731987,0,32,0z M32,62
		c-16.5419998,0-30-13.457901-30-30S15.4580002,2,32,2c16.542099,0,30,13.4579,30,30S48.542099,62,32,62z"
				/>
			</g>
		</svg>
	);
};

export const ThreadIconRightClick: React.FC<IconProps> = ({ defaultFill = '#AEAEAE', defaultSize = 'w-4 h-4' }) => {
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
				d="M12 2.81a1 1 0 0 1 0-1.41l.36-.36a1 1 0 0 1 1.41 0l9.2 9.2a1 1 0 0 1 0 1.4l-.7.7a1 1 0 0 1-1.3.13l-9.54-6.72a1 1 0 0 1-.08-1.58l1-1L12 2.8ZM12 21.2a1 1 0 0 1 0 1.41l-.35.35a1 1 0 0 1-1.41 0l-9.2-9.19a1 1 0 0 1 0-1.41l.7-.7a1 1 0 0 1 1.3-.12l9.54 6.72a1 1 0 0 1 .07 1.58l-1 1 .35.36ZM15.66 16.8a1 1 0 0 1-1.38.28l-8.49-5.66A1 1 0 1 1 6.9 9.76l8.49 5.65a1 1 0 0 1 .27 1.39ZM17.1 14.25a1 1 0 1 0 1.11-1.66L9.73 6.93a1 1 0 0 0-1.11 1.66l8.49 5.66Z"
				fill="currentColor"
				className=""
			></path>
		</svg>
	);
};

export const ForwardRightClick: React.FC<IconProps> = ({ defaultFill = '#AEAEAE', defaultSize = 'w-4 h-4' }) => {
	return (
		<svg
			className={defaultSize}
			aria-hidden="true"
			role="img"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			fill={defaultFill}
			viewBox="0 0 24 24"
			transform="scale(-1, 1)"
		>
			<path
				fill="currentColor"
				d="M2.3 7.3a1 1 0 0 0 0 1.4l5 5a1 1 0 0 0 1.4-1.4L5.42 9H11a7 7 0 0 1 7 7v4a1 1 0 1 0 2 0v-4a9 9 0 0 0-9-9H5.41l3.3-3.3a1 1 0 0 0-1.42-1.4l-5 5Z"
				className=""
			></path>
		</svg>
	);
};
