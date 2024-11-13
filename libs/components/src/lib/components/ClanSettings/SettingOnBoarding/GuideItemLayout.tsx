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
};

export const GuideItemLayout = ({
	title,
	description = 'Description',
	icon,
	hightLightIcon = false,
	action,
	className,
	background = 'bg-bgSecondaryHover',
	height,
	gap = 8,
	onClick
}: GuideItemLayoutProps) => {
	return (
		<div
			className={`p-4 flex items-start rounded-lg hover:bg-slate-800  ${height ? height : 'h-full'} ${background} ${className}`}
			style={{
				gap: gap
			}}
			onClick={onClick}
		>
			{icon && (
				<div className="h-full flex items-center justify-center">
					<div className={`${hightLightIcon ? 'rounded-full w-12 aspect-square bg-black' : ''}  flex items-center justify-center`}>
						{icon}
					</div>
				</div>
			)}
			<div className={`flex flex-1 text-base flex-col h-full justify-start`}>
				{title && <div className="font-bold text-white">{title}</div>}
				<div className="text-channelTextLabel text-xs flex-1">{description}</div>
			</div>
			{action && <div className="flex items-center h-full">{action}</div>}
		</div>
	);
};

export default GuideItemLayout;
