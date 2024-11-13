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
	gap?: string;
	onClick?: () => void;
};

export const GuideItemLayout = ({
	title,
	description = 'Description',
	icon,
	hightLightIcon = false,
	action,
	className,
	background = 'bg-[#282a2e]',
	height,
	gap = 'gap-2',
	onClick
}: GuideItemLayoutProps) => {
	return (
		<div
			className={`p-4 ${gap} flex items-start rounded-lg hover:bg-slate-800  ${height ? height : 'h-full'} ${background} ${className}`}
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
