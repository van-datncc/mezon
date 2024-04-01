import { Icons } from '../../components';

export const InputSearch: React.FC = () => {
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		
	};

	return (
		<div
			className={`transition-all duration-300 h-8 pl-4 pr-2 py-3 bg-[#1E1F22] relative rounded items-center inline-flex w-[97%] m-2 text-center`}
		>
			<input
				onChange={handleInputChange}
				type="text"
				placeholder="Search"
				className="text-[#AEAEAE] font-['Manrope'] placeholder-[#AEAEAE] outline-none bg-transparent w-full"
			/>
			<div className="w-5 h-6 flex flex-row items-center pl-1 absolute right-1 bg-[#1E1F22] top-1/4 transform -translate-y-1/2 m-2 cursor-pointer">
				<Icons.Search />
			</div>
		</div>
	);
};
