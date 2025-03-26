import { Icons } from '@mezon/ui';

interface FormErrorProps {
	message: string;
}

export function FormError({ message }: FormErrorProps) {
	if (!message) return null;

	return (
		<div className="text-sm text-red-500 flex items-center gap-1 mt-1">
			<Icons.WarningIcon />
			<span>{message}</span>
		</div>
	);
}
