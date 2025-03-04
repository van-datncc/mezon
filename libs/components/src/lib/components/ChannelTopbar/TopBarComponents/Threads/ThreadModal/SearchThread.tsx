import {
	selectCurrentChannelId,
	selectSearchedThreadLoadingStatus,
	selectThreadInputSearchByChannelId,
	threadsActions,
	useAppDispatch
} from '@mezon/store';
import { Icons } from '@mezon/ui';
import { Spinner } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { useThrottledCallback } from 'use-debounce';

const SearchThread = ({ setKeywordSearch }: { setKeywordSearch: React.Dispatch<React.SetStateAction<string>> }) => {
	const dispatch = useAppDispatch();
	const currentChannelId = useSelector(selectCurrentChannelId);
	const statusSearching = useSelector(selectSearchedThreadLoadingStatus);
	const isLoading = statusSearching === 'loading';
	const inputSearchValue = useSelector((state) => selectThreadInputSearchByChannelId(state, currentChannelId ?? ''));

	const handleTypingDebounced = useThrottledCallback((value: string) => {
		dispatch(threadsActions.searchedThreads({ label: value }));
	}, 500);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value.trim();
		dispatch(threadsActions.setThreadInputSearch({ channelId: currentChannelId, value }));
		handleTypingDebounced(value);
	};

	return (
		<div className="relative">
			<div className="transition-all duration-300 w-56 h-6 pl-4 pr-2 py-3 dark:bg-[#151515] bg-bgLightMode rounded items-center inline-flex">
				<input
					type="text"
					placeholder="Search for Thread Name"
					className="dark:text-contentTertiary text-black text-sm dark:placeholder-contentTertiary placeholder-bgPrimary placeholder:text-sm outline-none bg-transparent w-full"
					onChange={handleChange}
					value={inputSearchValue}
				/>
			</div>
			<div className="w-5 h-6 flex flex-row items-center pl-1 absolute right-1 bg-transparent top-1/2 transform -translate-y-1/2">
				{isLoading ? <Spinner className="w-4 h-4 mb-1" /> : <Icons.Search />}
			</div>
		</div>
	);
};

export default SearchThread;
