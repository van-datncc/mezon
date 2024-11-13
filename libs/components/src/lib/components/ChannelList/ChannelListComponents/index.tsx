import { useAppNavigation, useClans, usePathMatch, usePermissionChecker } from '@mezon/core';
import {
	EventManagementOnGogoing,
	eventManagementActions,
	onboardingActions,
	selectCurrentClanId,
	selectMissionDone,
	selectMissionSum,
	selectNumberEvent,
	selectOnboardingMode,
	selectOngoingEvent,
	selectShowNumEvent
} from '@mezon/store';
import { Icons } from '@mezon/ui';
import { EPermission } from '@mezon/utils';
import { memo, useEffect, useMemo, useState } from 'react';
import { useModal } from 'react-modal-hook';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import EventModal from '../EventChannelModal';

export const Events = memo(() => {
	const numberEventManagement = useSelector(selectNumberEvent);
	const ongoingEvent = useSelector(selectOngoingEvent);
	const [openModalDetail, setOpenModalDetail] = useState(false);

	const { setClanShowNumEvent } = useClans();
	const currentClanId = useSelector(selectCurrentClanId);
	const showNumEvent = useSelector(selectShowNumEvent(currentClanId || ''));
	const onboardingMode = useSelector(selectOnboardingMode);
	const [checkAdminPermission] = usePermissionChecker([EPermission.administrator]);

	const closeModal = () => {
		closeEventModal();
	};

	const openModal = () => {
		openEventModal();
		setClanShowNumEvent(false);
	};

	const handleOpenDetail = () => {
		openEventModal();
		setOpenModalDetail(true);
	};

	const memberPath = `/chat/clans/${currentClanId}/member-safety`;
	const channelSettingPath = `/chat/clans/${currentClanId}/channel-setting`;
	const serverGuidePath = `/chat/clans/${currentClanId}/guide`;
	const { isMemberPath, isSettingPath, isGuidePath } = usePathMatch({
		isMemberPath: memberPath,
		isSettingPath: channelSettingPath,
		isGuidePath: serverGuidePath
	});

	const [openEventModal, closeEventModal] = useModal(() => {
		return (
			<EventModal
				onClose={closeModal}
				numberEventManagement={numberEventManagement}
				openModalDetail={openModalDetail}
				setOpenModalDetail={setOpenModalDetail}
			/>
		);
	}, []);

	return (
		<>
			{onboardingMode && <OnboardingGetStart link={serverGuidePath} />}

			{ongoingEvent && <EventNotification event={ongoingEvent} handleOpenDetail={handleOpenDetail} />}

			<Link
				to={serverGuidePath}
				className={`self-stretch inline-flex cursor-pointer px-2 rounded h-[34px] ${isGuidePath ? 'dark:bg-bgModifierHover bg-bgModifierHoverLight' : ''} dark:hover:bg-bgModifierHover hover:bg-bgModifierHoverLight`}
			>
				<div className="grow w-5 flex-row items-center gap-2 flex">
					<div className="w-5 h-5 relative flex flex-row items-center">
						<div className="w-5 h-5 left-[1.67px] top-[1.67px] absolute">
							<Icons.GuideIcon defaultSize="w-5 h-5 dark:fill-channelTextLabel" defaultFill="" />
						</div>
					</div>
					<div className="w-[99px] dark:text-channelTextLabel text-colorTextLightMode text-base font-medium">Clan Guide</div>
				</div>
			</Link>

			<div
				className="self-stretch  items-center inline-flex cursor-pointer px-2 rounded h-[34px] dark:hover:bg-bgModifierHover hover:bg-bgLightModeButton"
				onClick={openModal}
			>
				<div className="grow w-5 flex-row items-center gap-2 flex">
					<div className="w-5 h-5 relative flex flex-row items-center">
						<div className="w-5 h-5 left-[1.67px] top-[1.67px] absolute">
							<Icons.IconEvents />
						</div>
					</div>
					<div className="w-[99px] dark:text-channelTextLabel text-colorTextLightMode text-base font-medium">
						{numberEventManagement === 0 && 'Events'}
						{numberEventManagement === 1 && '1 Event'}
						{numberEventManagement > 1 && `${numberEventManagement} Events`}
					</div>
				</div>
				{numberEventManagement !== 0 && showNumEvent && (
					<div className="w-5 h-5 p-2 bg-red-600 rounded-[50px] flex-col justify-center items-center flex">
						<div className="text-white text-xs font-medium">{numberEventManagement}</div>
					</div>
				)}
			</div>
			<Link
				to={memberPath}
				className={`self-stretch inline-flex cursor-pointer px-2 rounded h-[34px] ${isMemberPath ? 'dark:bg-bgModifierHover bg-bgModifierHoverLight' : ''} dark:hover:bg-bgModifierHover hover:bg-bgModifierHoverLight`}
			>
				<div className="grow w-5 flex-row items-center gap-2 flex">
					<div className="w-5 h-5 relative flex flex-row items-center">
						<div className="w-5 h-5 left-[1.67px] top-[1.67px] absolute">
							<Icons.MemberList defaultSize="w-5 h-5 dark:text-channelTextLabel" />
						</div>
					</div>
					<div className="w-[99px] dark:text-channelTextLabel text-colorTextLightMode text-base font-medium">Members</div>
				</div>
			</Link>
			{checkAdminPermission ? (
				<Link
					to={channelSettingPath}
					className={`self-stretch inline-flex cursor-pointer px-2 rounded h-[34px] ${isSettingPath ? 'dark:bg-bgModifierHover bg-bgModifierHoverLight' : ''} dark:hover:bg-bgModifierHover hover:bg-bgModifierHoverLight`}
				>
					<div className="grow w-5 flex-row items-center gap-2 flex">
						<div className="w-5 h-5 relative flex flex-row items-center">
							<div className="w-5 h-5">
								<Icons.SettingProfile className="w-5 h-5 dark:text-channelTextLabel text-colorTextLightMode" />
							</div>
						</div>
						<div className="w-full dark:text-channelTextLabel text-colorTextLightMode text-base font-medium">Channels</div>
					</div>
				</Link>
			) : null}
		</>
	);
});

const EventNotification = ({ event, handleOpenDetail }: { event: EventManagementOnGogoing; handleOpenDetail: () => void }) => {
	const dispatch = useDispatch();
	const handleCloseEvent = () => {
		dispatch(eventManagementActions.clearOngoingEvent(null));
	};
	return (
		<div className="w-[90%] mx-auto my-2 text-sm">
			<div className="flex justify-between">
				<div className="flex items-center">
					<div className="w-2 h-2 rounded-full bg-green-500"></div>
					<p className="text-green-500 text-base font-bold ml-2">Ongoing Event</p>
				</div>
				<Icons.CloseButton className="w-3 h-3 mt-2" onClick={handleCloseEvent} />
			</div>
			<p className="text-channelActiveLightColor dark:text-channelActiveColor mt-3 text-base font-medium">{event.title}</p>
			<div className="flex mt-2">
				<Icons.Location defaultFill="text-channelActiveLightColor dark:text-channelActiveColor" />
				<p className="ml-2 text-channelActiveLightColor dark:text-channelActiveColor">{event.address}</p>
			</div>
			<div className="text-center py-1 bg-green-700 mt-2 rounded select-none" onClick={handleOpenDetail}>
				<p className=" text-channelActiveLightColor dark:text-channelActiveColor  font-medium">Event detail</p>
			</div>
		</div>
	);
};

const OnboardingGetStart = ({ link }: { link: string }) => {
	const missionDone = useSelector(selectMissionDone);
	const missionSum = useSelector(selectMissionSum);

	const completionPercentage = useMemo(() => {
		return missionDone ? (missionDone / missionSum) * 100 - 100 : -97;
	}, [missionDone, missionSum]);
	const dispatch = useDispatch();
	const { navigate } = useAppNavigation();
	const handleNavigate = () => {
		navigate(link);
	};
	const handleClosePreview = () => {
		dispatch(onboardingActions.closeOnboardingMode());
	};
	const [openModalGetStarted, closeModalGetStarted] = useModal(() => {
		return (
			<div className="fixed z-50 top-0 left-0 w-screen  bg-black flex px-4 py-2 h-12 items-center justify-center ">
				<div className="absolute cursor-pointer hover:bg-slate-950 left-6 px-2 flex gap-1 border-2 py-1 items-center justify-center  border-white rounded bg-transparent">
					<Icons.LeftArrowIcon className="fill-white text-white" />
					<p className="text-white text-xs font-medium" onClick={handleClosePreview}>
						Close preview mode
					</p>
				</div>
				<div className="text-base text-white font-semibold">You are viewing the server as a new member. You have no roles.</div>
			</div>
		);
	});
	useEffect(() => {
		openModalGetStarted();
	}, []);

	return (
		<div className="w-full h-12 flex flex-col gap-1 relative" onClick={handleNavigate}>
			<div className="flex justify-between">
				<p className="text-sm font-bold text-white">Get Started</p>
				<div className="flex gap-[1px] items-center">
					<p className="text-xs font-bold text-white">{missionDone}</p>
					<p className="text-xs">of</p>
					<p className="text-xs font-bold text-white">{missionSum}</p>
					<Icons.ArrowRight defaultSize="w-3 h-3" />
				</div>
			</div>
			<div className="flex bg-slate-700 relative rounded-2xl w-full h-1 overflow-hidden">
				<div
					className="absolute w-full h-full transition-transform duration-1000 bg-[#16A34A]  rounded-2xl"
					style={{
						animation: 'transform 1s ease-out',
						transform: `translateX(${completionPercentage}%)`
					}}
				></div>
			</div>
			<hr className="absolute bottom-1 left-0 h-[0.08px] w-full dark:border-borderDivider border-white" />
		</div>
	);
};
