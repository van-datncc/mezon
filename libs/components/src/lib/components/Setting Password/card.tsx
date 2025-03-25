import type { ReactNode } from 'react';

interface CardProps {
	children: ReactNode;
	className?: string;
}

export function Card({ children, className = '' }: CardProps) {
	return <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>{children}</div>;
}

interface CardHeaderProps {
	children: ReactNode;
	className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
	return <div className={`p-6 border-b border-gray-200 ${className}`}>{children}</div>;
}

interface CardTitleProps {
	children: ReactNode;
	className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
	return <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h2>;
}

interface CardDescriptionProps {
	children: ReactNode;
	className?: string;
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
	return <p className={`mt-1 text-sm text-gray-500 ${className}`}>{children}</p>;
}

interface CardContentProps {
	children: ReactNode;
	className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
	return <div className={`p-6 ${className}`}>{children}</div>;
}

interface CardFooterProps {
	children: ReactNode;
	className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
	return <div className={`p-6 border-t border-gray-200 ${className}`}>{children}</div>;
}
