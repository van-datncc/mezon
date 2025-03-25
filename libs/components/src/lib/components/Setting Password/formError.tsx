interface FormErrorProps {
	message: string;
}

export function FormError({ message }: FormErrorProps) {
	if (!message) return null;

	return (
		<div className="text-sm text-red-500 flex items-center gap-1 mt-1">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<circle cx="12" cy="12" r="10" />
				<line x1="12" y1="8" x2="12" y2="12" />
				<line x1="12" y1="16" x2="12.01" y2="16" />
			</svg>
			<span>{message}</span>
		</div>
	);
}
