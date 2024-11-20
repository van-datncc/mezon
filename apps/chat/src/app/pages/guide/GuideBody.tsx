import { GuideItemLayout } from '@mezon/components';
import { useAppNavigation } from '@mezon/core';
import {
	ETypeMission,
	fetchOnboarding,
	onboardingActions,
	selectChannelById,
	selectChannelFirst,
	selectCurrentClanId,
	selectOnboardingByClan,
	selectOnboardingMode,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { Icons } from '@mezon/ui';
import { titleMission } from '@mezon/utils';
import { ApiOnboardingItem } from 'mezon-js/api.gen';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

function GuideBody() {
	const onboadingMode = useSelector(selectOnboardingMode);
	const firstChannelId = useSelector(selectChannelFirst);
	const currentClanId = useSelector(selectCurrentClanId);
	const { navigate, toChannelPage, toMembersPage } = useAppNavigation();
	const dispatch = useAppDispatch();

	const handleDoMission = (type: number) => {
		if (onboadingMode) {
			switch (type) {
				case ETypeMission.SEND_MESSAGE: {
					const link = toChannelPage(firstChannelId.channel_id as string, currentClanId as string);
					navigate(link);
					dispatch(onboardingActions.doneMission());
					break;
				}
				case ETypeMission.VISIT: {
					const memberPage = toMembersPage(currentClanId as string);
					navigate(memberPage);
					dispatch(onboardingActions.doneMission());
					break;
				}
				case ETypeMission.DOSOMETHING: {
					dispatch(onboardingActions.doneMission());
					break;
				}
				default:
					break;
			}
		}
	};

	const onboardingItem = useAppSelector((state) => selectOnboardingByClan(state, currentClanId as string));

	useEffect(() => {
		dispatch(fetchOnboarding({ clan_id: currentClanId as string }));
	}, []);

	return (
		<div className="w-full h-full pt-4 ">
			<div className="flex gap-6">
				<div className="flex-1 flex flex-col gap-2">
					<div className="flex flex-col gap-2">
						<p className="text-xl font-bold">Resources</p>
						{onboardingItem &&
							onboardingItem.rule.length > 0 &&
							onboardingItem.rule.map((rule) => (
								<GuideItemLayout
									key={rule.id}
									title={rule.title}
									hightLightIcon={true}
									description={rule.content}
									icon={<Icons.RuleIcon />}
									action={<div className="w-[72px] aspect-square bg-black rounded-lg"></div>}
								/>
							))}
					</div>

					<div className="flex flex-col gap-2">
						<p className="text-xl font-bold">Missions </p>
						{onboardingItem &&
							onboardingItem.mission.length > 0 &&
							onboardingItem.mission.map((mission, index) => (
								<GuideItemMission
									key={mission.id}
									mission={mission}
									onClick={() => handleDoMission(index)}
									onboadingMode={onboadingMode}
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

type TypeItemMission = {
	mission: ApiOnboardingItem;
	onClick: () => void;
	onboadingMode: boolean;
};

const GuideItemMission = ({ mission, onClick, onboadingMode }: TypeItemMission) => {
	const channelById = useSelector((state) => selectChannelById(state, mission.channel_id as string));
	return (
		<GuideItemLayout
			key={mission.id}
			title={mission.title}
			className="cursor-pointer"
			hightLightIcon={true}
			icon={<Icons.TargetIcon defaultSize="w-6 h-6" />}
			onClick={onClick}
			description={
				<span>
					{titleMission[mission.task_type ? mission.task_type - 1 : 0] || ''}{' '}
					<span className="font-semibold text-channelActiveColor"> #{channelById?.channel_label} </span>{' '}
				</span>
			}
			action={<div className={`w-6 aspect-square  rounded-full ${onboadingMode ? 'bg-green-500' : 'bg-black'}`}></div>}
		/>
	);
};

export default GuideBody;
