import * as Icons from '../../../Icons';

const SearchThread = () => {
	const hanldeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		console.log('event', event.target.value);
	};

	return (
		<div className="relative">
			<div className={`transition-all duration-300 w-56 h-6 pl-4 pr-2 py-3 bg-[#151515] rounded items-center inline-flex`}>
				<input
					type="text"
					placeholder="Search for Thread Name"
					className="text-[#AEAEAE] text-sm font-['Manrope'] placeholder-[#AEAEAE] placeholder:text-sm outline-none bg-transparent w-full"
					onChange={(event) => hanldeChange(event)}
				/>
			</div>
			<div className="w-5 h-6 flex flex-row items-center pl-1 absolute right-1 bg-transparent top-1/2 transform -translate-y-1/2">
				<Icons.Search />
			</div>
		</div>
	);
};

export default SearchThread;
