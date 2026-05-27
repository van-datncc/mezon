import { Icons } from '@mezon/ui';
import { memo } from 'react';
import { voiceChromeIconClass } from '../voiceChromeStyles';

interface FullscreenControlProps {
	isGridView?: boolean;
	isShowMember?: boolean;
	isFullScreen: boolean | undefined;
	onToggle: () => void;
}

export const FullscreenControl = memo(({ isFullScreen, onToggle }: FullscreenControlProps) => {
	const iconClassName = `cursor-pointer ${voiceChromeIconClass}`;

	return (
		<div onClick={onToggle}>
			{isFullScreen ? (
				<span>
					<Icons.ExitFullScreen className={iconClassName} />
				</span>
			) : (
				<span>
					<Icons.FullScreen className={iconClassName} />
				</span>
			)}
		</div>
	);
});
