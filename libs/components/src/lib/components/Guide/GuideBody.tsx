import { Icons } from '@mezon/ui';
import { ReactNode } from 'react';

function GuideBody() {
	return (
		<div className="w-full h-full pt-4 ">
			<div className="flex gap-6">
				<div className="flex-1 flex flex-col gap-2">
					<p className="text-xl font-bold">Resources</p>
					<GuideItemLayout
						title="Title"
						hightLightIcon={true}
						icon={<Icons.AddServe />}
						action={<div className="w-[72px] aspect-square bg-black rounded-lg"></div>}
					/>
				</div>
				<div className="flex flex-col gap-2 h-20 p-4 w-[300px] text-base justify-between bg-[#282a2e] rounded-lg">
					<div className="font-bold text-white">About</div>
					<div className="text-channelTextLabel text-xs">Members online</div>
				</div>
			</div>
		</div>
	);
}

type GuideItemLayoutProps = {
	icon?: ReactNode;
	action?: ReactNode;
	background?: string;
	className?: string;
	hightLightIcon?: boolean;
	title?: string;
	description?: string;
	height?: string;
};

const GuideItemLayout = ({
	title = 'Title',
	description = 'Description',
	icon,
	hightLightIcon = false,
	action,
	className,
	background = 'bg-[#282a2e]',
	height
}: GuideItemLayoutProps) => {
	return (
		<div className={`p-4 gap-2 flex items-start rounded-lg hover:bg-slate-800  ${height ? height : 'h-full'} ${background} ${className}`}>
			{icon && (
				<div className="h-full flex items-center justify-center">
					<div className={`${hightLightIcon ? 'rounded-full w-12 aspect-square bg-black' : ''}  flex items-center justify-center`}>
						{icon}
					</div>
				</div>
			)}
			<div className="flex flex-1 text-base flex-col gap-2 h-full justify-start">
				{title && <div className="font-bold text-white">#{title}</div>}
				<div className="text-channelTextLabel">{description}</div>
			</div>
			{action && <div className="flex items-center">{action}</div>}
		</div>
	);
};

export default GuideBody;
