import { useAuth } from '@mezon/core';
import { useState } from 'react';
import SettingRightClan from '../SettingRightClanProfile';
import SettingRightUser from '../SettingRightUserProfile';
import SettingRightWithdraw from '../SettingRightWithdraw';

type SettingRightProfileProps = {
	menuIsOpen: boolean;
	isDM: boolean;
};

enum EActiveType {
	USER_SETTING = 'USER_SETTING',
	CLAN_SETTING = 'CLAN_SETTING',
	WITHDRAW_SETTING = 'WITHDRAW_SETTING'
}

const SettingRightProfile = ({ menuIsOpen, isDM }: SettingRightProfileProps) => {
	const { userProfile } = useAuth();
	const [activeType, setActiveType] = useState<EActiveType>(EActiveType.USER_SETTING);

	const handleClanProfileClick = () => {
		setActiveType(EActiveType.CLAN_SETTING);
	};

	const handleUserSettingsClick = () => {
		setActiveType(EActiveType.USER_SETTING);
	};
	const handleWithdrawSettingsClick = () => {
		setActiveType(EActiveType.WITHDRAW_SETTING);
	};

	return (
		<div
			className={`overflow-y-auto flex flex-col flex-1 shrink dark:bg-bgPrimary bg-white w-1/2 pt-[94px] pb-7 sbm:pr-[10px] pr-[40px] pl-[40px] overflow-x-hidden ${menuIsOpen === true ? 'min-w-[700px]' : ''} 2xl:min-w-[900px] max-w-[740px] hide-scrollbar z-20`}
		>
			<div className="dark:text-white text-black">
				<h1 className="text-xl font-semibold tracking-wider">Profiles</h1>
				<div className="flex flex-row gap-4 mt-6 mb-4">
					<button
						onClick={handleUserSettingsClick}
						className={`pt-1 font-medium text-base tracking-wider border-b-2 ${activeType === EActiveType.USER_SETTING ? 'border-[#155EEF]' : 'border-transparent dark:text-textThreadPrimary text-textSecondary800'}`}
					>
						User Profile
					</button>

					{!isDM ? (
						<button
							onClick={handleClanProfileClick}
							className={`pt-1 font-medium text-base tracking-wider border-b-2 ${activeType === EActiveType.CLAN_SETTING ? 'border-[#155EEF]' : 'border-transparent dark:text-textThreadPrimary text-textSecondary800'}`}
						>
							Clan Profiles
						</button>
					) : null}
					<button
						onClick={handleWithdrawSettingsClick}
						className={`pt-1 font-medium text-base tracking-wider border-b-2 ${activeType === EActiveType.WITHDRAW_SETTING ? 'border-[#155EEF]' : 'border-transparent dark:text-textThreadPrimary text-textSecondary800'}`}
					>
						Withdraw
					</button>
				</div>
			</div>

			<div className="flex-1 flex z-0 gap-x-8 sbm:flex-row flex-col">
				{activeType === EActiveType.USER_SETTING ? (
					<SettingRightUser
						onClanProfileClick={handleClanProfileClick}
						name={userProfile?.user?.username || ''}
						avatar={userProfile?.user?.avatar_url || ''}
						currentDisplayName={userProfile?.user?.display_name || ''}
						aboutMe={userProfile?.user?.about_me || ''}
						isDM={isDM}
					/>
				) : activeType === EActiveType.CLAN_SETTING ? (
					<SettingRightClan />
				) : (
					<SettingRightWithdraw />
				)}
			</div>
		</div>
	);
};

export default SettingRightProfile;
