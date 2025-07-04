import { selectAllClans } from '@mezon/store';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import SettingUserClanProfileEdit from './SettingUserClanProfileEdit';

interface SettingUserClanProfileEditProps {
	clanId: string;
}

const SettingRightClan: React.FC<SettingUserClanProfileEditProps> = ({ clanId }) => {
	const clans = useSelector(selectAllClans);
	const [flagOption, setFlagOption] = useState<boolean>(false);
	const [selectedClanId, setSelectedClanId] = useState<string | undefined>(clanId as string);

	const handleClanChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedClanId(event.target.value);
	};

	return (
		<div className="flex flex-col">
			<div className="flex flex-col xl:flex-row gap-x-1 text-sm font-normal">
				<p className="">Show who you are with different profiles for each of your clans</p>
			</div>
			<p className="mt-[20px] font-bold text-sm  tracking-wide">CHOOSE A CLAN</p>
			<select
				name="clan"
				className="block w-full mt-1 bg-item-theme px-4 py-3 font-normal text-sm tracking-wide outline-none border-theme-primary"
				disabled={flagOption}
				value={selectedClanId}
				onChange={handleClanChange}
			>
				{clans.map((clan) => (
					<option key={clan.id} value={clan.id} style={{ width: '200px' }} className="theme-base-color rounded-lg bg-item-hover">
						{clan.clan_name}
					</option>
				))}
			</select>
			<SettingUserClanProfileEdit flagOption={flagOption} setFlagOption={setFlagOption} clanId={selectedClanId ?? ''} />
		</div>
	);
};
export default SettingRightClan;
