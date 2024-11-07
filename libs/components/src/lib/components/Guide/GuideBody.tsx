import { Icons } from '@mezon/ui';
import { ReactNode } from 'react';

function GuideBody() {
	return (
		<div className="w-full h-full">
			<GuideItemLayout
				title="Title"
				hightLightIcon={true}
				icon={<Icons.AddServe />}
				action={<div className="w-[72px] aspect-square bg-black rounded-md"></div>}
			/>
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
};

const GuideItemLayout = ({
	title = 'Title',
	description = 'Description',
	icon,
	hightLightIcon = false,
	action,
	className,
	background = 'bg-[#282a2e]'
}: GuideItemLayoutProps) => {
	return (
		<div className={`p-4 gap-2 flex items-start rounded-md hover:bg-slate-800 ${background} ${className} h-full`}>
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
