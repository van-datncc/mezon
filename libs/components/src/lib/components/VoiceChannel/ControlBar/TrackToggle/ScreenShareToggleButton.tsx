import { selectShowScreen } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { useSelector } from 'react-redux';

export interface ScreenShareToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
	onClick?: () => void;
}

export const ScreenShareToggleButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
	({ className, onClick, ...props }, ref) => {
		const showScreen = useSelector(selectShowScreen);

		const defaultClassName = 'lk-button lk-track-toggle';

		return (
			<button ref={ref} className={`${defaultClassName} ${className}`} onClick={onClick} {...props}>
				{showScreen ? <Icons.VoiceScreenShareStopIcon /> : <Icons.VoiceScreenShareIcon />}
			</button>
		);
	}
);
