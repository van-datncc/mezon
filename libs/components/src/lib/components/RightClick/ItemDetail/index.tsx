import { RightClickList } from '@mezon/utils';
import { memo, useLayoutEffect, useState } from 'react';

interface IItemDetail {
	item: any;
	urlData?: string;
	onClick: () => void;
}

const ItemDetail: React.FC<IItemDetail> = ({ item, urlData, onClick }) => {
	const [redColor, setRedColor] = useState<boolean>(false);
	useLayoutEffect(() => {
		if (
			item.name === RightClickList.DELETE_MESSAGE ||
			item.name === RightClickList.REMOVE_ALL_REACTIONS ||
			item.name === RightClickList.REMOVE_REACTIONS ||
			item.name === RightClickList.REPORT_MESSAGE
		) {
			setRedColor(true);
		} else setRedColor(false);
	}, [item.name]);

	return (
		<span
			onClick={onClick}
			className={`flex justify-between items-center text-sm pl-1 py-1
				cursor-pointer rounded-sm 
				${
					redColor
						? 'text-[#E13542] hover:text-[#FFFFFF] dark:hover:bg-[#E13542] hover:bg-[#4B5CD6]'
						: 'text-[#81858A] hover:text-[#FFFFFF] dark:hover:bg-[#4B5CD6] hover:bg-[#4B5CD6]'
				} font-medium
				 `}
		>
			<span className={`w-[90%]`}>{item.name}</span>
			<span className={`w-[10%] flex justify-end mr-1`}>{item.symbol}</span>
		</span>
	);
};
export default memo(ItemDetail);
