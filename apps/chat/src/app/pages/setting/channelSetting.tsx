import { ListChannelSetting } from '@mezon/components';
import { channelSettingActions, selectAllChannelSuggestion, selectCurrentClanId, useAppDispatch } from '@mezon/store';
import { ChannelStatusEnum } from '@mezon/utils';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const ChannelSetting = () => {
	const [privateFilter, setPrivateFilter] = useState(false);
	const [searchFilter, setSearchFilter] = useState('');
	const listChannel = useSelector(selectAllChannelSuggestion);
	const dispatch = useAppDispatch();
	const selectClanId = useSelector(selectCurrentClanId);

	const handleFilterPrivateChannel = (e: ChangeEvent<HTMLInputElement>) => {
		setPrivateFilter(e.target.checked);
	};
	const handleSearchByNameChannel = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchFilter(e.target.value);
	};

	const listChannelSetting = useMemo(() => {
		return listChannel.filter((channel) => {
			if (privateFilter && channel.channel_private !== ChannelStatusEnum.isPrivate) {
				return false;
			}
			if (!channel.channel_label?.includes(searchFilter)) {
				return false;
			}
			return true;
		});
	}, [privateFilter, searchFilter, listChannel.length]);

	useEffect(() => {
		async function fetchListChannel() {
			await dispatch(channelSettingActions.fetchChannelByUserId({ clanId: selectClanId as string }));
		}
		fetchListChannel();
	}, []);
	return (
		<div className="p-8 h-[calc(100vh_-_56px)] flex flex-col">
			<div className="p-2 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						id="private_filter"
						defaultChecked={privateFilter}
						onChange={handleFilterPrivateChannel}
						className="w-4 h-4 rounded-md border-channelTextLabel overflow-hidden"
					/>
					<label htmlFor="private_filter">
						Only Private Channel <span className="font-semibold italic">({listChannelSetting.length})</span>
					</label>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="text"
						value={searchFilter}
						placeholder="Search"
						onChange={handleSearchByNameChannel}
						className=" max-w-60 h-8 pl-2 pr-2 py-3 dark:bg-bgTertiary bg-bgLightTertiary rounded items-center inline-flex outline-none focus:outline-none"
					/>
				</div>
			</div>
			<ListChannelSetting listChannel={listChannelSetting} />
		</div>
	);
};
export default ChannelSetting;
