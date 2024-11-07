import { Image } from '@mezon/ui';

interface ISettingOnBoardingProps {
	menuIsOpen: boolean;
}

const SettingOnBoarding = ({ menuIsOpen }: ISettingOnBoardingProps) => {
	return (
		<div
			className={`"overflow-y-auto flex flex-col gap-6 flex-1 shrink dark:bg-bgPrimary bg-white w-1/2 pt-[94px] pb-7 pr-[10px] sbm:pl-[40px] pl-[10px] overflow-x-hidden ${menuIsOpen === true ? 'min-w-[700px]' : ''} 2xl:min-w-[900px] max-w-[740px] hide-scrollbar dark:text-channelTextLabel text-colorTextLightMode text-sm"`}
		>
			<div className="flex flex-col gap-2">
				<div className="text-[20px] text-white font-semibold">On Boarding</div>
				<div className="font-medium">Give your members a simple starting experience with custom channels, roles and first steps.</div>
				<div className="flex gap-2 items-center">
					<div className="cursor-pointer text-blue-500 hover:underline">See examples</div>
					<div className="w-1 h-1 rounded-full bg-gray-600" />
					<div className="cursor-pointer text-blue-500 hover:underline">Preview</div>
					<div className="w-1 h-1 rounded-full bg-gray-600" />
					<div className="cursor-pointer text-blue-500 hover:underline">Switch to Advanced Mode</div>
				</div>
			</div>
			<div className="flex gap-4 items-center rounded-lg dark:bg-[#2b2d31] p-4">
				<div className="w-fit">
					<Image
						src={`assets/images/wumpus_addbba.svg`}
						alt={'wumpus'}
						width={40}
						height={40}
						className="aspect-square object-cover w-[40px]"
					/>
				</div>
				<div className="flex flex-col gap-2 text-[14px]">
					<div className="font-semibold text-white">Recent Updates</div>
					<div className="font-medium">
						<div>• You can now upload custom images for New-Member To-Dos and Resource Pages.</div>
						<div>• Added a custom description option for Resource pages</div>
					</div>
				</div>
			</div>
			<div>
				<div className="bg-bgTertiary rounded-t-lg px-4 py-3 flex justify-between items-center">
					<div>
						<div className="text-white">Onboarding Is Enabled</div>
						<div className="text-[12px]">Changes will not take effect until you save.</div>
					</div>
					<div>
						<input
							className="peer relative h-4 w-8 cursor-pointer appearance-none rounded-lg
                            bg-slate-300 transition-colors after:absolute after:top-0 after:left-0 after:h-4 after:w-4 after:rounded-full
                            after:bg-slate-500 after:transition-all checked:bg-blue-200 checked:after:left-4 checked:after:bg-blue-500
                            hover:bg-slate-400 after:hover:bg-slate-600 checked:hover:bg-blue-300 checked:after:hover:bg-blue-600
                            focus:outline-none checked:focus:bg-blue-400 checked:after:focus:bg-blue-700 focus-visible:outline-none disabled:cursor-not-allowed
                            disabled:bg-slate-200 disabled:after:bg-slate-300"
							type="checkbox"
						/>
					</div>
				</div>
				<div></div>
				<div />
				<div></div>
				<div />
				<div></div>
			</div>
		</div>
	);
};

export default SettingOnBoarding;
