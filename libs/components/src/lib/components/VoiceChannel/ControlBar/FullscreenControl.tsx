import { Icons } from '@mezon/ui';
import { memo } from 'react';

interface FullscreenControlProps {
	isGridView?: boolean;
	isShowMember?: boolean;
	isFullScreen: boolean | undefined;
	onToggle: () => void;
}

export const FullscreenControl = memo(({ isFullScreen, onToggle }: FullscreenControlProps) => {
	const iconClassName = 'cursor-pointer text-[var(--bg-icon-theme)] hover:text-[var(--bg-icon-theme-active)]';

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
