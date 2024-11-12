import { useAppNavigation } from '@mezon/core';
import { onboardingActions, selectChannelFirst, selectCurrentClanId, selectOnboardingMode } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function GuideBody() {
	const onboadingMode = useSelector(selectOnboardingMode);
	const firstChannelId = useSelector(selectChannelFirst);
	const currentClanId = useSelector(selectCurrentClanId);
	const { navigate, toChannelPage } = useAppNavigation();
	const dispatch = useDispatch();
	const handleDoMission = () => {
		if (onboadingMode) {
			// const link = toChannelPage(firstChannelId.channel_id as string,currentClanId as string);
			// navigate(link);
			dispatch(onboardingActions.doneMission());
		}
	};

	const openOnboardingMode = () => {
		dispatch(onboardingActions.openOnboardingMode());
	};
	return (
		<div className="w-full h-full pt-4 ">
			<div className="flex gap-6">
				<div className="flex-1 flex flex-col gap-2">
					<div className="flex flex-col gap-2">
						<p className="text-xl font-bold">Resources</p>
						<GuideItemLayout
							title="Title"
							hightLightIcon={true}
							icon={<Icons.RuleIcon />}
							action={<div className="w-[72px] aspect-square bg-black rounded-lg"></div>}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<p className="text-xl font-bold">
							Missions{' '}
							<span className="cursor-pointer ml-4 text-primary hover:underline text-sm font-normal" onClick={openOnboardingMode}>
								preview
							</span>
						</p>
						<GuideItemLayout
							title="Sends message in first channel"
							className="cursor-pointer"
							hightLightIcon={true}
							icon={<Icons.TargetIcon defaultSize="w-6 h-6" />}
							onClick={handleDoMission}
							action={<div className="w-6 aspect-square bg-black rounded-full"></div>}
						/>

						<GuideItemLayout
							title="Visit or create one thread"
							className="cursor-pointer"
							hightLightIcon={true}
							icon={<Icons.TargetIcon defaultSize="w-6 h-6" />}
							onClick={handleDoMission}
							action={<div className="w-6 aspect-square bg-black rounded-full"></div>}
						/>

						<GuideItemLayout
							title="Doing something"
							className="cursor-pointer"
							hightLightIcon={true}
							icon={<Icons.TargetIcon defaultSize="w-6 h-6" />}
							onClick={handleDoMission}
							action={<div className="w-6 aspect-square bg-black rounded-full"></div>}
						/>
					</div>
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

export default GuideBody;
