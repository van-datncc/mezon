import { ListChannelSetting } from '@mezon/components';
import { ChangeEvent, useState } from 'react';

const ChannelSetting = () => {
	const [privateFilter, setPrivateFilter] = useState(false);
	const [searchFilter, setSearchFilter] = useState('');

	const handleFilterPrivateChannel = (e: ChangeEvent<HTMLInputElement>) => {
		setPrivateFilter(e.target.checked);
	};
	const handleSearchByNameChannel = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchFilter(e.target.value);
	};
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
					<label htmlFor="private_filter">Only Private Channel</label>
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
			<ListChannelSetting privateFilter={privateFilter} searchFilter={searchFilter} />
		</div>
	);
};
export default ChannelSetting;
