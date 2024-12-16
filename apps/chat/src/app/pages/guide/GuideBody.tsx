import { GuideItemLayout } from '@mezon/components';
import { useAppNavigation } from '@mezon/core';
import {
	ETypeMission,
	fetchOnboarding,
	onboardingActions,
	selectAnswerByQuestionId,
	selectChannelById,
	selectCurrentClanId,
	selectFormOnboarding,
	selectKeepAnswerNumber,
	selectMissionDone,
	selectMissionSum,
	selectOnboardingByClan,
	selectOnboardingMode,
	selectProcessingByClan,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { Icons } from '@mezon/ui';
import { DONE_ONBOARDING_STATUS, titleMission } from '@mezon/utils';
import { ApiOnboardingItem } from 'mezon-js/api.gen';
import { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

function GuideBody() {
	const onboadingMode = useSelector(selectOnboardingMode);
	const currentClanId = useSelector(selectCurrentClanId);
	const { navigate, toChannelPage } = useAppNavigation();
	const dispatch = useAppDispatch();
	const formOnboarding = useSelector(selectFormOnboarding);
	const missionSum = useSelector(selectMissionSum);
	const missionDone = useSelector(selectMissionDone);
	const selectUserProcessing = useSelector(selectProcessingByClan(currentClanId as string));
	const keepAnswerNumber = useSelector(selectKeepAnswerNumber);
	const handleDoMission = useCallback(
		(mission: ApiOnboardingItem, index: number) => {
			if (index === missionDone || selectUserProcessing?.onboarding_step === DONE_ONBOARDING_STATUS) {
				switch (mission.task_type) {
					case ETypeMission.SEND_MESSAGE: {
						const link = toChannelPage(mission.channel_id as string, currentClanId as string);
						navigate(link);
						break;
					}
					case ETypeMission.VISIT: {
						const linkChannel = toChannelPage(mission.channel_id as string, currentClanId as string);
						navigate(linkChannel);
						dispatch(onboardingActions.doneMission({ clan_id: currentClanId as string }));
						doneAllMission(index);
						break;
					}
					case ETypeMission.DOSOMETHING: {
						dispatch(onboardingActions.doneMission({ clan_id: currentClanId as string }));
						doneAllMission(index);
						break;
					}
					default:
						break;
				}
			}
		},
		[missionSum]
	);

	const doneAllMission = (indexMision: number) => {
		if (indexMision + 1 === missionSum) {
			dispatch(onboardingActions.doneOnboarding({ clan_id: currentClanId as string }));
		}
	};

	const onboardingItem = useAppSelector((state) => selectOnboardingByClan(state, currentClanId as string));

	const answerNumberPercent = useMemo(() => {
		let answerDone = 0;
		Object.values(keepAnswerNumber).map((answer) => {
			if (answer.length) {
				answerDone++;
			}
		});
		return answerDone ? (answerDone / onboardingItem.question.length) * 100 - 100 : -97;
	}, [keepAnswerNumber, onboardingItem.question.length]);
	useEffect(() => {
		dispatch(fetchOnboarding({ clan_id: currentClanId as string }));
	}, []);

	return (
		<div className="w-full h-full pt-4 ">
			<div className="flex gap-6">
				<div className="flex-1 flex flex-col gap-2 ">
					<div className="flex flex-col gap-2 ">
						<div className="flex gap-2 items-center">
							<p className="text-xl font-bold">Questions</p>
						</div>
						<div className="bg-bgSecondaryHover flex flex-col gap-2 rounded-lg relative">
							{onboardingItem?.question.length > 0 &&
								onboardingItem?.question.map((question) => <QuestionItems question={question} key={question.id} />)}
							<div className="absolute top-0 -left-4 w-1 h-full">
								<div className="flex bg-slate-700 relative rounded-2xl w-1 h-full overflow-hidden">
									<div
										className="absolute w-1 h-full transition-transform duration-1000 bg-[#16A34A]  rounded-2xl "
										style={{
											animation: 'transform 1s ease-out',
											transform: `translateY(${answerNumberPercent}%)`
										}}
									></div>
								</div>
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<p className="text-xl font-bold">Resources</p>
						{onboardingItem?.rule?.length > 0 ? (
							onboardingItem.rule.map((rule) => (
								<GuideItemLayout
									key={rule.id}
									title={rule.title}
									hightLightIcon={true}
									description={rule.content}
									icon={<Icons.RuleIcon />}
									action={
										<div className="w-[72px] aspect-square bg-black rounded-lg flex overflow-hidden">
											{rule.image_url && <img src={rule.image_url} className="w-full h-full object-cover" />}
										</div>
									}
								/>
							))
						) : (
							<>
								{(!onboadingMode || (onboadingMode && formOnboarding?.rules?.length === 0)) && (
									<div className="flex gap-2 h-20 p-4 w-full text-lg items-center text-channelTextLabel font-semibold justify-between bg-[#282a2e] rounded-lg">
										You don't have any rule. Setting rule for this clan first !!
									</div>
								)}
							</>
						)}
						{onboadingMode &&
							formOnboarding?.rules?.length > 0 &&
							formOnboarding.rules.map((rule, index) => (
								<GuideItemLayout
									key={index}
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
						{onboardingItem?.mission?.length > 0 ? (
							onboardingItem.mission.map((mission, index) => (
								<GuideItemMission
									key={mission.id}
									mission={mission}
									onClick={() => handleDoMission(mission, index)}
									tick={missionDone > index || selectUserProcessing?.onboarding_step === DONE_ONBOARDING_STATUS}
								/>
							))
						) : (
							<>
								{(!onboadingMode || (onboadingMode && formOnboarding?.task?.length === 0)) && (
									<div className="flex gap-2 h-20 p-4 w-full text-lg items-center text-channelTextLabel font-semibold justify-between bg-[#282a2e] rounded-lg">
										You don't have any mission. Setting mision for this clan first !!
									</div>
								)}
							</>
						)}
						{onboadingMode &&
							formOnboarding?.task?.length > 0 &&
							formOnboarding.task.map((mission, index) => (
								<GuideItemMission key={mission.title} mission={mission} onClick={() => handleDoMission(mission, index)} tick={true} />
							))}
					</div>
				</div>
				<div className="mt-8 flex flex-col gap-2 h-20 p-4 w-[300px] text-base justify-between bg-[#282a2e] rounded-lg">
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
	tick: boolean;
};

const GuideItemMission = ({ mission, onClick, tick }: TypeItemMission) => {
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
			action={
				<>
					{tick && (
						<div className={`w-6 aspect-square  rounded-full flex items-center justify-center`}>
							<Icons.Tick fill="#40C174" defaultSize="w-6 h-6" />
						</div>
					)}
				</>
			}
		/>
	);
};

const QuestionItems = ({ question }: { question: ApiOnboardingItem }) => {
	const dispatch = useAppDispatch();
	const selectAnswer = useSelector((state) => selectAnswerByQuestionId(state, question.id as string));
	const handleOnClickQuestion = (index: number) => {
		dispatch(
			onboardingActions.doAnswer({
				answer: index,
				idQuestion: question.id as string
			})
		);
	};
	const hightLight = useCallback(
		(index: number) => {
			if (selectAnswer.includes(index)) {
				return 'bg-bgSurface hover:border-bgSurface hover:bg-[#212121] text-primary hover:border-white border-channelActiveColor';
			}
			return;
		},
		[selectAnswer.length]
	);
	return (
		<div className="w-full p-4 flex flex-col gap-2">
			<p className="text-channelActiveColor font-semibold">{question.title} ?</p>
			<div className="flex flex-wrap gap-2 flex-1">
				{question.answers &&
					question.answers.map((answer, index) => (
						<GuideItemLayout
							key={answer.title}
							icon={answer.emoji}
							description={answer.description}
							title={answer.title}
							height={'h-auto'}
							onClick={() => handleOnClickQuestion(index)}
							className={` w-fit h-fit rounded-xl hover:bg-transparent text-white justify-center items-center px-4 py-2 border-2 border-[#4e5058] hover:border-[#7d808c]  font-medium flex gap-2 ${hightLight(index)}`}
						/>
					))}
			</div>
		</div>
	);
};

export default GuideBody;
