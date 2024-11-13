import { MemberProvider } from '@mezon/core';
import { channelSettingActions, onboardingActions, selectEnableStatusOfOnBoarding, useAppDispatch } from '@mezon/store';
import { Icons, Image } from '@mezon/ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import GuideItemLayout from './GuideItemLayout';
import ClanGuideSetting from './Mission/ClanGuideSetting';
import Questions from './Questions/Questions';

enum EOnboardingStep {
	QUESTION,
	MISSION,
	MAIN
}
const SettingOnBoarding = () => {
	const dispatch = useAppDispatch();
	const toggleEnableStatus = () => {
		dispatch(channelSettingActions.toggleOnBoarding());
	};

	const isEnableOnBoarding = useSelector(selectEnableStatusOfOnBoarding);

	const [currentPage, setCurrentPage] = useState<EOnboardingStep>(EOnboardingStep.MAIN);
	const handleGoToPage = (page: EOnboardingStep) => {
		setCurrentPage(page);
	};

	return (
		<div className="dark:text-channelTextLabel text-colorTextLightMode text-sm">
			{currentPage === EOnboardingStep.MAIN && (
				<MainIndex handleGoToPage={handleGoToPage} isEnableOnBoarding={isEnableOnBoarding} toggleEnableStatus={toggleEnableStatus} />
			)}
			{currentPage === EOnboardingStep.QUESTION && <Questions />}
			{currentPage === EOnboardingStep.MISSION && (
				<MemberProvider>
					<ClanGuideSetting />
				</MemberProvider>
			)}
		</div>
	);
};

interface IMainIndexProps {
	isEnableOnBoarding: boolean;
	toggleEnableStatus: () => void;
	handleGoToPage: (page: EOnboardingStep) => void;
}

const MainIndex = ({ isEnableOnBoarding, toggleEnableStatus, handleGoToPage }: IMainIndexProps) => {
	const dispatch = useAppDispatch();
	const openOnboardingMode = () => {
		dispatch(onboardingActions.openOnboardingMode());
	};
	return (
		<div className="flex flex-col gap-6 flex-1">
			<div className="flex flex-col gap-2">
				<div className="text-[20px] text-white font-semibold">On Boarding</div>
				<div className="font-medium">Give your members a simple starting experience with custom channels, roles and first steps.</div>
				<div className="flex gap-2 items-center">
					<div className="cursor-pointer text-blue-500 hover:underline">See examples</div>
					<div className="w-1 h-1 rounded-full bg-gray-600" />
					<div className="cursor-pointer text-blue-500 hover:underline" onClick={openOnboardingMode}>
						Preview
					</div>
					<div className="w-1 h-1 rounded-full bg-gray-600" />
					<div className="cursor-pointer text-blue-500 hover:underline">Switch to Advanced Mode</div>
				</div>
			</div>
			<GuideItemLayout
				icon={
					<Image
						src={`assets/images/wumpus_addbba.svg`}
						alt={'wumpus'}
						width={40}
						height={40}
						className="aspect-square object-cover w-[40px]"
					/>
				}
				title="Recent Updates"
				description={
					<div className="font-medium text-sm">
						<div>• You can now upload custom images for New-Member To-Dos and Resource Pages.</div>
						<div>• Added a custom description option for Resource pages</div>
					</div>
				}
			/>

			<div className="text-white">
				<GuideItemLayout
					title="Onboarding Is Enabled"
					description="Changes will not take effect until you save."
					className="hover:bg-bgTertiary bg-bgTertiary rounded-none rounded-t-lg "
					action={
						<div className="h-full flex items-center">
							<input
								className="peer relative h-4 w-8 cursor-pointer appearance-none rounded-lg
														bg-slate-300 transition-colors after:absolute after:top-0 after:left-0 after:h-4 after:w-4 after:rounded-full
														after:bg-slate-500 after:transition-all checked:bg-blue-200 checked:after:left-4 checked:after:bg-blue-500
														hover:bg-slate-400 after:hover:bg-slate-600 checked:hover:bg-blue-300 checked:after:hover:bg-blue-600
														focus:outline-none checked:focus:bg-blue-400 checked:after:focus:bg-blue-700 focus-visible:outline-none disabled:cursor-not-allowed
														disabled:bg-slate-200 disabled:after:bg-slate-300"
								type="checkbox"
								checked={isEnableOnBoarding}
								onChange={toggleEnableStatus}
							/>
						</div>
					}
				/>

				<GuideItemLayout
					hightLightIcon
					icon={<Icons.HashIcon className="w-6 text-channelTextLabel" />}
					title="Default Channels"
					description="You have 7 Default Channels"
					className="hover:bg-bgSecondaryHover rounded-none"
					action={
						<div className="w-[60px] h-[32px] flex justify-center items-center rounded-sm border border-bgModifierHover hover:bg-bgModifierHover cursor-pointer">
							Edit
						</div>
					}
				/>
				<div className="mx-4 border-t border-bgModifierHover" />

				<GuideItemLayout
					hightLightIcon
					icon={<Icons.People className="w-6 text-channelTextLabel" />}
					title="Questions"
					description="7 of 7 public channels are assignable through Questions and Default Channels."
					className="hover:bg-bgSecondaryHover rounded-none"
					action={
						<div
							onClick={() => handleGoToPage(EOnboardingStep.QUESTION)}
							className="px-3 py-2 flex gap-2 justify-center items-center rounded-sm bg-gray-600 hover:bg-gray-500 transition-colors cursor-pointer"
						>
							<div>Set up</div> <Icons.LongArrowRight className="w-3" />
						</div>
					}
				/>
				<div className="mx-4 border-t border-bgModifierHover" />
				<GuideItemLayout
					hightLightIcon
					icon={<Icons.People className="w-6 text-channelTextLabel" />}
					title="Server Guide"
					description="Your Welcome Message, Banner, To-Do tasks and Resources are all set up"
					className="hover:bg-bgSecondaryHover rounded-none"
					action={
						<div className="flex items-center gap-4">
							{isEnableOnBoarding && (
								<input
									className="peer relative h-4 w-8 cursor-pointer appearance-none rounded-lg
													bg-slate-300 transition-colors after:absolute after:top-0 after:left-0 after:h-4 after:w-4 after:rounded-full
													after:bg-slate-500 after:transition-all checked:bg-blue-200 checked:after:left-4 checked:after:bg-blue-500
													hover:bg-slate-400 after:hover:bg-slate-600 checked:hover:bg-blue-300 checked:after:hover:bg-blue-600
													focus:outline-none checked:focus:bg-blue-400 checked:after:focus:bg-blue-700 focus-visible:outline-none disabled:cursor-not-allowed
													disabled:bg-slate-200 disabled:after:bg-slate-300"
									type="checkbox"
								/>
							)}
							<div
								className="w-[60px] h-[32px] flex justify-center items-center rounded-sm border border-bgModifierHover hover:bg-bgModifierHover cursor-pointer"
								onClick={() => handleGoToPage(EOnboardingStep.MISSION)}
							>
								Edit
							</div>
						</div>
					}
				/>
			</div>
		</div>
	);
};

export default SettingOnBoarding;
