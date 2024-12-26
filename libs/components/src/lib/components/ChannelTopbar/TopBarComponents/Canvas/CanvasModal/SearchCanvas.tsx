import { useTopbarContext } from '@mezon/core';
import { Icons } from '@mezon/ui';

const SearchCanvas = () => {
	const hanldeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value.trim());
	};
	const { searchQuery, setSearchQuery } = useTopbarContext();

	return (
		<div className="relative">
			<div className={`transition-all duration-300 w-56 h-6 pl-4 pr-2 py-3 dark:bg-[#151515] bg-bgLightMode rounded items-center inline-flex`}>
				<input
					type="text"
					placeholder="Search for Canvas Name"
					className="dark:text-contentTertiary text-black text-sm dark:placeholder-contentTertiary placeholder-bgPrimary placeholder:text-sm outline-none bg-transparent w-full"
					onChange={(event) => hanldeChange(event)}
					value={searchQuery}
				/>
			</div>
			<div className="w-5 h-6 flex flex-row items-center pl-1 absolute right-1 bg-transparent top-1/2 transform -translate-y-1/2">
				<Icons.Search />
			</div>
		</div>
	);
};

export default SearchCanvas;
