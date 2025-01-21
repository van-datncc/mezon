import React from 'react';

type FloatButtonProps = {
	content: string;
	backgroundColor: string;
	textColor: string;
	onClick: () => void;
	className?: string;
};

export const FloatButton: React.FC<FloatButtonProps> = ({ content, backgroundColor, textColor, onClick, className }) => {
	return (
		<div
			style={{
				backgroundColor: backgroundColor,
				color: textColor
			}}
			onClick={onClick}
			className={
				'shadow-lg text-sm text-white bg-contentBrand rounded-full py-1 px-2 w-fit my-2 font-semibold align-center cursor-pointer opacity-90 hover:opacity-95 active:opacity-100 ' +
				className
			}
		>
			{content}
		</div>
	);
};
