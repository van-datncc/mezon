import { Pagination } from 'flowbite-react';
import { useState } from 'react';
import MemberTopBar from './MemberTopBar';
import TableMember from './TableMember';

const MemberClan = () => {
	const [currentPage, setCurrentPage] = useState(1);

	const onPageChange = (page: number) => setCurrentPage(page);
	return (
		<div className="flex flex-col flex-1 shrink min-w-0 w-full bg-bgSecondaryHover h-[100%] overflow-y-auto z-0 p-4">
			<div className="flex flex-col bg-bgPrimary rounded-lg">
				<MemberTopBar />

				<TableMember />

				<div className="flex flex-row justify-between items-center px-4 h-[54px] border-t-[1px] border-borderDivider mb-2">
					<div>Show 12 members of 375</div>
					<Pagination currentPage={1} totalPages={100} onPageChange={onPageChange} />
				</div>
			</div>
		</div>
	);
};

export default MemberClan;
