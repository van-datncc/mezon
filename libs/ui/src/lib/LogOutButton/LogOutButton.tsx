import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../Button';
import ButtonLoading from '../Button/ButtonLoading';
interface ModalProps {
	onClose: () => void;
	handleLogOut: () => void;
	isDeleting?: boolean;
}

export const LogoutModal: React.FC<ModalProps> = ({ handleLogOut, onClose }) => {
	const { t } = useTranslation('common');
	return (
		<div className="fixed  inset-0 flex items-center justify-center z-50">
			<div className="fixed inset-0 bg-black opacity-80"></div>
			<div className="relative z-10 bg-theme-setting-primary p-6 rounded-[5px] text-center">
				<h2 className="text-[30px] font-semibold mb-4  text-theme-primary">{t('logOut')}</h2>
				<p
					className="text-theme-primary
				 mb-6 text-[16px]"
				>
					{t('confirmLogOut')}
				</p>
				<div className="flex justify-center mt-10 text-[14px]">
					<Button
						onClick={onClose}
						className="px-4 py-2 mr-5 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:ring focus:border-blue-300"
					>
						{t('cancel')}
					</Button>
					<ButtonLoading
						onClick={handleLogOut}
						className="px-4 py-2 rounded focus:ring bg-[#da373c] text-white hover:opacity-80"
						label={t('logOut')}
					/>
				</div>
			</div>
		</div>
	);
};

export const DeleteAccountModal: React.FC<ModalProps> = ({ handleLogOut, onClose, isDeleting }) => {
	const { t } = useTranslation('common');
	return (
		<div className="fixed  inset-0 flex items-center justify-center z-50">
			<div className="fixed inset-0 bg-black opacity-80"></div>
			<div className="relative z-10 bg-theme-setting-primary p-6 rounded-lg text-center w-[90%] sm:w-auto">
				<h2 className="text-[30px] font-semibold mb-4 text-theme-primary ">{t('deleteAccount')}</h2>
				<p
					className="text-theme-primary
				 mb-6 text-[16px]"
				>
					{t('confirmDeleteAccount')}
				</p>
				<div className="flex justify-center mt-10 text-[14px]">
					<Button
						onClick={onClose}
						className="px-4 py-2 mr-5 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:ring focus:border-blue-300"
					>
						{t('cancel')}
					</Button>
					<ButtonLoading
						onClick={handleLogOut}
						disabled={isDeleting}
						className={`px-4 py-2 rounded text-white bg-red-500 hover:opacity-80 `}
						label={t('delete')}
					/>
				</div>
			</div>
		</div>
	);
};
