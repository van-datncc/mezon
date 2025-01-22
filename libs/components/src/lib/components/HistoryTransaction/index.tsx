import { fetchListWalletLedger, selectCountWalletLedger, selectWalletLedger, useAppDispatch, useAppSelector } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { formatNumber } from '@mezon/utils';
import { Pagination } from 'flowbite-react';

import { useEffect, useState } from 'react';
const limitWallet = 8;

interface IProps {
	onClose: () => void;
}
const HistoryTransaction = ({ onClose }: IProps) => {
	const dispatch = useAppDispatch();
	const walletLedger = useAppSelector((state) => selectWalletLedger(state));
	const count = useAppSelector((state) => selectCountWalletLedger(state));
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = count === undefined ? 0 : Math.ceil(count / limitWallet);

	useEffect(() => {
		dispatch(fetchListWalletLedger({ page: 1 }));
	}, [dispatch]);

	const onPageChange = (page: number) => {
		setCurrentPage(page);
		dispatch(fetchListWalletLedger({ page: page }));
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	};
	const renderAmount = (amount: number) => {
		if (amount < 0) {
			return <p className="text-red-500 font-medium">{`${formatNumber(amount, 'vi-VN', 'VND')}`}</p>;
		}
		return <p className="text-green-500 font-medium">{`+${formatNumber(amount, 'vi-VN', 'VND')}`}</p>;
	};
	return (
		<div className="outline-none justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-30 focus:outline-none bg-black bg-opacity-80 dark:text-white text-black hide-scrollbar overflow-hidden">
			<div className={`relative w-full mt-[5%] sm:h-auto rounded-lg max-w-[600px] `}>
				<div className="rounded-t-lg text-sm overflow-hidden">
					<div className="dark:bg-[#1E1F22] bg-bgLightModeSecond dark:text-white text-black flex justify-between items-center p-6">
						<div>
							<h4 className="font-bold text-base">History Transaction</h4>
						</div>
						<span className="text-3xl leading-3 dark:hover:text-white hover:text-black" onClick={onClose}>
							×
						</span>
					</div>
				</div>
				{walletLedger?.length ? (
					<>
						<div>
							{walletLedger?.map((item, index) => {
								return (
									<div key={index} className="bg-white flex  border-b border-zinc-400 px-6 py-2 justify-between ">
										<div className=" flex flex-col gap-2">
											<p className="text-black">{formatDate(item.create_time ?? '')}</p>
											<div className="text-zinc-400 flex flex-row gap-1">
												<p className="">Transaction Code:</p>
												<p>{item.transaction_id}</p>
											</div>
										</div>
										<div className=" flex justify-center items-center ">{renderAmount(item.value ?? 0)}</div>
									</div>
								);
							})}
						</div>
						<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
					</>
				) : (
					<div className="flex items-center justify-center bg-white  ">
						<div className="flex flex-col gap-1 py-20 items-center">
							<Icons.EmptyType />

							<h2 className="text-black ">No transaction</h2>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default HistoryTransaction;
