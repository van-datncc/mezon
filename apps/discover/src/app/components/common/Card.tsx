import React from 'react';

interface CardProps {
	children: React.ReactNode;
	className?: string;
	onClick?: () => void;
	hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverable = false }) => {
	const baseStyles = 'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden';
	const hoverStyles = hoverable ? 'transition-transform hover:shadow-md hover:-translate-y-1 cursor-pointer' : '';

	return (
		<div className={`${baseStyles} ${hoverStyles} ${className}`} onClick={onClick}>
			{children}
		</div>
	);
};

export default Card;
