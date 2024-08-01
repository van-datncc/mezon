import { deleteWebhookById, useAppDispatch } from '@mezon/store';
import { ApiWebhook } from 'mezon-js/api.gen';

interface IDeleteWebhookPopupProps {
	handleShowPopUp: () => void;
	webhookItem: ApiWebhook;
}

const DeleteWebhookPopup = ({ handleShowPopUp, webhookItem }: IDeleteWebhookPopupProps) => {
	const dispatch = useAppDispatch();
	const handleDeleteWebhook = (webhook: ApiWebhook) => {
		dispatch(deleteWebhookById(webhook));
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			<div className="fixed inset-0 bg-black opacity-80"></div>
			<div className="relative z-10 w-[440px]">
				<div className='dark:bg-[#313338] bg-white pt-[16px] px-[16px]'>
					<div className='dark:text-textDarkTheme text-textLightTheme text-[20px] font-semibold pb-[16px]'>Delete {webhookItem.webhook_name}</div>
					<div className='dark:text-[#dbdee1] text-textLightTheme pb-[20px]'>
						Are you sure want to delete the <b className='font-semibold'>{webhookItem.webhook_name}</b> webhook? This action cannot be undone
					</div>
				</div>
				<div className='dark:bg-[#2b2d31] bg-[#f2f3f5] dark:text-textDarkTheme text-textLightTheme flex justify-end items-center gap-4 p-[16px] text-[14px] font-medium'>
					<div onClick={handleShowPopUp} className='hover:underline cursor-pointer'>Cancel</div>
					<div onClick={()=>handleDeleteWebhook(webhookItem)} className="bg-red-600 hover:bg-red-700 text-white rounded-sm px-[25px] py-[8px] cursor-pointer">Delete</div>
				</div>
			</div>
		</div>
	);
};

export default DeleteWebhookPopup;
