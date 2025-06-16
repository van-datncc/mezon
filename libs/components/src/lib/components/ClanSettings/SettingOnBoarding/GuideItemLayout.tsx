import { ReactNode } from 'react';

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
	noNeedHover?: boolean;
};

export const GuideItemLayout = ({
	title,
	description,
	icon,
	hightLightIcon = false,
	action,
	className,
	background = 'bg-gray-200 dark:bg-gray-800',
	height,
	gap = 8,
	onClick,
	noNeedHover
}: GuideItemLayoutProps) => {
	return (
		<div
			className={`p-4 flex items-start rounded-lg ${noNeedHover ? '' : 'hover:bg-gray-300 dark:hover:bg-gray-700'} ${height ? height : 'h-full'} ${background} ${className}`}
			style={{
				gap: gap
			}}
			onClick={onClick}
		>
			{icon && (
				<div className="h-full flex items-center justify-center">
					<div className={`${hightLightIcon ? 'rounded-full w-12 aspect-square bg-gray-800 dark:bg-black' : ''}  flex items-center justify-center`}>
						{icon}
					</div>
				</div>
			)}
			<div className={`flex flex-1 text-base flex-col h-full justify-start`}>
				{title && <div className="font-bold text-gray-900 dark:text-white">{title}</div>}
				{description && <div className="text-gray-700 dark:text-channelTextLabel text-xs flex-1">{description}</div>}
			</div>
			{action && <div className="flex items-center h-full">{action}</div>}
		</div>
	);
};

export default GuideItemLayout;
