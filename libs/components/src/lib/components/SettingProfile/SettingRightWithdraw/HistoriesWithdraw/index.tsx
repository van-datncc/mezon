import { Pagination } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
interface IProp {
	userId: string | undefined;
	onRefresh?: boolean;
}
enum WITHDRAWAR_STATUS {
	Pending = 1,
	Approved = 2,
	Rejected = 3
}
interface History {
	id: string;
	walletAddress: string;
	status: number;
	requestTime: Date;
	transactionHash: string;
	isConfirmed?: boolean;
}
const MEZON_TREASURY_URL = process.env.NX_CHAT_APP_MEZON_TREASURY_URL || '';
const MEZONTREASURY_API_KEY = process.env.NX_CHAT_APP_API_MEZONTREASURY_KEY || '';

const HistoriesWithdraw = ({ userId, onRefresh }: IProp) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [data, setData] = useState<History[]>([]);

	const onPageChange = (page: number) => {
		setCurrentPage(page);
	};
	const fetchHistory = async (page: number) => {
		try {
			const response = await fetch(`${MEZON_TREASURY_URL}/api/withdraws/user-histories`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Treasury-Key': MEZONTREASURY_API_KEY
				},
				body: JSON.stringify({
					page: page,
					limit: 5,
					mezonUserId: userId
				})
			});
			if (!response.ok) {
				throw new Error('Failed to fetch data');
			}

			const result = await response.json();
			setData(result.data.items || []);
			setTotalPages(result.data.totalPages || 1);
		} catch (error) {
			toast.error(`Error fetching history`);
			console.error('Error fetching data:', error);
		}
	};
	const transformDate = (time: Date) => {
		if (!time) return '';
		const date = new Date(time);

		return date.toLocaleString('vi-VN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	const getStatusText = (status: WITHDRAWAR_STATUS): string => {
		switch (status) {
			case WITHDRAWAR_STATUS.Pending:
				return 'Pending';
			case WITHDRAWAR_STATUS.Approved:
				return 'Approved';
			case WITHDRAWAR_STATUS.Rejected:
				return 'Rejected';
			default:
				return 'Created';
		}
	};
	const handleHiddenText = (text: string, isAddress = false) => {
		if (!text) return '';
		const hiddenText = text.replace(/^(.{6}).*(.{4})$/, '$1••••••••••••••••$2');

		const polygonscanLink = isAddress
			? `${process.env.NX_CHAT_APP_MEZON_TREASURY_URL_NETWORK}/address/${text}`
			: `${process.env.NX_CHAT_APP_MEZON_TREASURY_URL_NETWORK}/tx/${text}`;

		return (
			<a href={polygonscanLink} target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-700 dark:text-gray-400">
				{hiddenText}
			</a>
		);
	};
	useEffect(() => {
		fetchHistory(currentPage);
	}, [currentPage, onRefresh]);

	return (
		<div className="w-full">
			<div className=" rounded-lg shadow">
				<div className="relative w-full overflow-auto">
					<table className="w-full text-sm rounded-lg">
						<thead>
							<tr className="bg-gray-50 dark:bg-gray-700">
								<th className="sticky top-0 px-6 py-4  text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase w-[30%] lg:w-1/3">
									Address Wallet
								</th>
								<th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase w-[30%]">
									Transaction
								</th>
								<th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase w-[20%]">
									Time Request
								</th>

								<th className="sticky top-0 px-6 py-4 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase w-[20%] ">
									Status
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-center">
							{data.map((item) => (
								<tr key={item.id} className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700">
									<td className="px-6 py-4 text-gray-900 dark:text-gray-400 break-all text-left">
										{handleHiddenText(item.walletAddress, true)}
									</td>
									<td className="px-6 py-4 text-left text-gray-500 dark:text-gray-400 break-all">
										{handleHiddenText(item.transactionHash)}
									</td>
									<td className="px-6 py-4 text-left text-gray-500 dark:text-gray-400">{transformDate(item.requestTime)}</td>

									<td className="px-6 py-4 text-left">
										<span
											className={`inline-flex px-2 py-1 rounded-full text-xs font-medium
                          ${
								getStatusText(item.status) === 'Pending'
									? 'bg-yellow-100 text-yellow-800'
									: getStatusText(item.status) === 'Approved'
										? 'bg-green-100 text-green-800'
										: 'bg-red-100 text-red-800'
							}`}
										>
											{getStatusText(item.status)}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<div className="flex justify-end">
				<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
			</div>
		</div>
	);
};

export default HistoriesWithdraw;
