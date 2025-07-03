import { Icons } from '@mezon/ui';
import { useState } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	onClick: () => Promise<unknown>;
	label: string;
	className?: string;
	disable?: boolean;
}

const ButtonWithLoading: React.FC<ButtonProps> = ({ onClick, label, className = '', disable = false, ...rest }) => {
	const [loading, setLoading] = useState(false);

	const handleClick = async () => {
		// Nếu đang loading hoặc đã bị disable từ props thì ngăn không cho nhấn
		if (loading || disable) return;

		setLoading(true);
		try {
			await onClick();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<button
			{...rest}
			onClick={handleClick}
			disabled={disable || loading}
			className={`rounded-md flex items-center justify-center gap-2 px-4 py-2 bg-primary min-w-32 w-fit ${className} ${disable || loading ? '!bg-bgDisable !cursor-not-allowed' : ''}`}
		>
			{loading ? <Icons.IconLoadingTyping bgFill="mx-auto" /> : label}
		</button>
	);
};

export default ButtonWithLoading;
