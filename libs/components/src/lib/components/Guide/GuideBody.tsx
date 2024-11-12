import { useAppNavigation } from '@mezon/core';
import { onboardingActions, selectChannelFirst, selectCurrentClanId, selectOnboardingMode } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { ReactNode, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function GuideBody() {
	const onboadingMode = useSelector(selectOnboardingMode);
	const firstChannelId = useSelector(selectChannelFirst);
	const currentClanId = useSelector(selectCurrentClanId);
	const { navigate, toChannelPage, toMembersPage } = useAppNavigation();
	const dispatch = useDispatch();

	const handleDoMission = (type: number) => {
		if (onboadingMode) {
			switch (type) {
				case 0: {
					const link = toChannelPage(firstChannelId.channel_id as string, currentClanId as string);
					navigate(link);
					dispatch(onboardingActions.doneMission());
					break;
				}
				case 1: {
					const memberPage = toMembersPage(currentClanId as string);
					navigate(memberPage);
					dispatch(onboardingActions.doneMission());
					break;
				}
				case 2: {
					dispatch(onboardingActions.doneMission());
					break;
				}
				default:
					break;
			}
		}
	};

	const openOnboardingMode = () => {
		dispatch(onboardingActions.openOnboardingMode());
	};

	const listMission = useMemo(() => {
		if (!firstChannelId) {
			return [];
		}

		const listTask = [
			{
				title: `Sends message in #${firstChannelId.channel_label}`,
				description: `Sends message in #${firstChannelId.channel_label}`
			},
			{
				title: "Visit clan's members list ",
				description: `Open clan's members list`
			},
			{
				title: 'Visit events clans ',
				description: `Open events clan`
			}
		];
		return listTask;
	}, [firstChannelId]);

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
						{listMission.map((mission, index) => (
							<GuideItemLayout
								key={mission.title}
								title={mission.title}
								className="cursor-pointer"
								hightLightIcon={true}
								icon={<Icons.TargetIcon defaultSize="w-6 h-6" />}
								onClick={() => handleDoMission(index)}
								description={mission.description}
								action={<div className={`w-6 aspect-square  rounded-full ${onboadingMode ? 'bg-green-500' : 'bg-black'}`}></div>}
							/>
						))}
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
