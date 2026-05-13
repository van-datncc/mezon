import { generateE2eId } from '@mezon/utils';
import type { ReactNode } from 'react';

type GuideItemLayoutProps = {
	icon?: ReactNode;
	action?: ReactNode;
	background?: string;
	className?: string;
	hightLightIcon?: boolean;
	title?: string;
	description?: ReactNode;
	height?: string;
	gap?: number;
	onClick?: () => void;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	noNeedHover?: boolean;
};

export const GuideItemLayout = ({
	title,
	description,
	icon,
	hightLightIcon = false,
	action,
	className,
	background = '',
	height,
	gap = 8,
	onClick,
	onMouseEnter,
	onMouseLeave,
	noNeedHover
}: GuideItemLayoutProps) => {
	return (
		<div
			className={`p-3 md:p-4 flex items-start rounded-lg ${noNeedHover ? '' : 'bg-item-hover border-theme-primary bg-theme-setting-nav text-theme-primary-hover'} ${height ? height : 'h-full'} ${background} ${className} overflow-x-hidden`}
			style={{
				gap
			}}
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			data-e2e={generateE2eId('button.base')}
		>
			{icon && (
				<div className="h-full flex items-center justify-center text-theme-primary flex-shrink-0">
					<div className={`${hightLightIcon ? 'rounded-full w-10 md:w-12 aspect-square ' : ''}  flex items-center justify-center`}>
						{icon}
					</div>
				</div>
			)}
			<div className={`flex flex-1 text-sm md:text-base flex-col h-full justify-center text-theme-primary min-w-0`}>
				{title && (
					<div className="font-bold text-theme-primary-active break-words" data-e2e={generateE2eId('onboarding.clan_guide_page.title')}>
						{title}
					</div>
				)}
				{description && (
					<div className="text-xs flex-1 break-words" data-e2e={generateE2eId('onboarding.clan_guide_page.description')}>
						{description}
					</div>
				)}
			</div>
			{action && (
				<div className="flex items-center h-full flex-shrink-0" data-e2e={generateE2eId('onboarding.clan_guide_page.action')}>
					{action}
				</div>
			)}
		</div>
	);
};

export default GuideItemLayout;
