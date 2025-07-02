import { useAppParams, useAuth, useUserById } from '@mezon/core';
import { ChannelMembersEntity, selectDmGroupCurrent, selectUpdateToken } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import HistoriesWithdraw from './HistoriesWithdraw';
import LazyWithdrawModal from './LazyWithdrawModal';

interface IWithdrawProp {
	onClose: () => void;
}

const SettingRightWithdraw = ({ onClose }: IWithdrawProp) => {
	const { directId } = useAppParams();
	const currentDmGroup = useSelector(selectDmGroupCurrent(directId ?? ''));
	const [openModalWithdraw, setOpenModelWithdraw] = useState<boolean>(false);
	const userID = Array.isArray(currentDmGroup?.user_id) ? currentDmGroup?.user_id[0] : currentDmGroup?.user_id;
	const userById: ChannelMembersEntity | undefined = useUserById(userID);
	const [showCoin, setShowCoin] = useState<boolean>(false);
	const getTokenSocket = useSelector(selectUpdateToken(userById?.id ?? ''));
	const { userProfile } = useAuth();
	const [refreshHistory, setRefreshHistory] = useState(false);
	const tokenInWallet = useMemo(() => {
		return userProfile?.wallet || 0;
	}, [userProfile?.wallet, refreshHistory]);
	const userId = userProfile?.user?.id;

	const toggleVisibility = () => {
		setShowCoin(!showCoin);
	};

	const closeModal = () => {
		setOpenModelWithdraw(false);
		setRefreshHistory((prev) => !prev);
	};

	const openModal = () => {
		setOpenModelWithdraw(true);
	};

	const totalToken = useMemo(() => {
		return Number(tokenInWallet) + Number(getTokenSocket);
	}, [userProfile?.wallet]);

	const handleRefetch = () => {
		setRefreshHistory((prev) => !prev);
	};

	return (
		<div className="outline-none justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-30 focus:outline-none bg-black bg-opacity-80 dark:text-white text-black hide-scrollbar overflow-hidden">
			<div className="relative w-full mt-[5%] sm:h-auto rounded-xl max-w-[900px] mx-4">
				<div className="dark:bg-bgPrimary bg-bgLightMode rounded-t-xl border-b dark:border-gray-700 border-gray-200">
					<div className="flex items-center justify-between p-6">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full dark:bg-green-600 bg-green-500 flex items-center justify-center">
								<Icons.DollarIcon isWhite className="w-5 h-5" />
							</div>
							<div>
								<h4 className="dark:text-white text-gray-900 text-lg font-semibold">Withdraw Funds</h4>
								<p className="dark:text-gray-400 text-gray-500 text-sm">Transfer your tokens to external wallet</p>
							</div>
						</div>
						<button
							onClick={onClose}
							className="dark:text-gray-400 text-gray-500 hover:dark:text-white hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
						>
							<Icons.Close className="w-5 h-5" />
						</button>
					</div>
				</div>

				<div className="dark:bg-bgPrimary bg-bgLightMode rounded-b-xl p-6 space-y-6">
					{openModalWithdraw && (
						<LazyWithdrawModal userId={userId} onClose={closeModal} totalToken={totalToken} onRefetch={handleRefetch} />
					)}

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="dark:text-white text-gray-900 font-semibold flex items-center gap-2">
								<Icons.DollarIcon className="w-4 h-4" />
								Available Balance
							</h3>
							<button onClick={toggleVisibility} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
								{showCoin ? (
									<Icons.EyeOpen className="w-5 h-5 dark:text-gray-400 text-gray-500" />
								) : (
									<Icons.EyeClose className="w-5 h-5 dark:text-gray-400 text-gray-500" />
								)}
							</button>
						</div>

						<div className="dark:bg-gray-800 bg-white rounded-xl border dark:border-gray-700 border-gray-200 p-6">
							<div className="flex items-center justify-between">
								<div className="flex flex-col">
									<div className="flex items-center gap-2 mb-2">
										<div className="w-8 h-8 rounded-full dark:bg-blue-600 bg-blue-500 flex items-center justify-center">
											<Icons.DollarIcon isWhite className="w-4 h-4" />
										</div>
										<span className="dark:text-gray-400 text-gray-500 text-sm font-medium">Total Balance</span>
									</div>
									<div className="text-3xl font-bold dark:text-white text-gray-900">
										{!showCoin ? (
											<span className="text-gray-400">••••••••</span>
										) : (
											<span className="flex items-baseline gap-2">
												{totalToken.toLocaleString('vi-VN')}
												<span className="text-lg dark:text-gray-400 text-gray-500 font-medium">VND</span>
											</span>
										)}
									</div>
									<p className="dark:text-gray-400 text-gray-500 text-sm mt-1">Available for withdrawal</p>
								</div>
								<button
									onClick={openModal}
									disabled={totalToken <= 0}
									className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
								>
									<Icons.ArrowDown className="w-4 h-4 rotate-180" />
									Withdraw
								</button>
							</div>

							<div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t dark:border-gray-700 border-gray-200">
								<div className="text-center">
									<p className="dark:text-gray-400 text-gray-500 text-xs font-medium uppercase tracking-wide">Wallet Balance</p>
									<p className="dark:text-white text-gray-900 text-lg font-semibold mt-1">
										{showCoin ? `${tokenInWallet.toLocaleString('vi-VN')} VND` : '••••••'}
									</p>
								</div>
								<div className="text-center">
									<p className="dark:text-gray-400 text-gray-500 text-xs font-medium uppercase tracking-wide">Socket Balance</p>
									<p className="dark:text-white text-gray-900 text-lg font-semibold mt-1">
										{showCoin ? `${getTokenSocket.toLocaleString('vi-VN')} VND` : '••••••'}
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<h3 className="dark:text-white text-gray-900 font-semibold flex items-center gap-2">
							<Icons.ViewRole className="w-4 h-4" />
							Withdrawal History
						</h3>

						<div className="dark:bg-gray-800 bg-white rounded-xl border dark:border-gray-700 border-gray-200 p-6">
							<HistoriesWithdraw userId={userId} onRefresh={refreshHistory} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SettingRightWithdraw;