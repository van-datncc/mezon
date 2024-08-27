import { useAppNavigation, useCategory } from '@mezon/core';
import {
	categoriesActions,
	useAppDispatch
} from '@mezon/store';
import { useNavigate } from 'react-router-dom';

type DeleteModalProps = {
	onClose: () => void;
	onCloseModal?: () => void;
	clanId: string;
	categoryId: string;
	categoryName: string;
};

const DeleteCategoryModal = ({ onClose, onCloseModal, clanId, categoryId, categoryName }: DeleteModalProps) => {
	const dispatch = useAppDispatch();
	const { categorizedChannels } = useCategory();
	const { toChannelPage } = useAppNavigation();
	const navigate = useNavigate();

	const handleDeleteCategory = async (categoryId: string) => {
		await dispatch(categoriesActions.deleteCategory({ clanId, categoryId }));
		const targetIndex = categorizedChannels.findIndex((obj) => obj.category_id === categoryId);

		let channelNavId = '';
		if (targetIndex !== -1) {
			if (targetIndex === 0) {
				channelNavId = categorizedChannels[targetIndex + 1]?.channels[0]?.id;
			} else if (targetIndex === categorizedChannels.length - 1) {
				channelNavId = categorizedChannels[targetIndex - 1]?.channels[0]?.id;
			} else {
				channelNavId = categorizedChannels[targetIndex - 1]?.channels[0]?.id;
			}
		}
		const channelPath = toChannelPage(channelNavId ?? '', clanId ?? '');
		navigate(channelPath);

		onClose();
		if (onCloseModal) {
			onCloseModal();
		}
	};

	return (
		<div className="fixed  inset-0 flex items-center justify-center z-50 dark:text-white text-black">
			<div className="fixed inset-0 bg-black opacity-80"></div>
			<div className="relative z-10 dark:bg-gray-900 bg-bgLightModeSecond p-6 rounded-[5px] text-center">
				<h2 className="text-[30px] font-semibold mb-4">Delete Category</h2>
				<p className="text-white-600 mb-6 text-[16px]">
					Are you sure you want to delete <b>{categoryName}</b> ? This cannot be undone.
				</p>
				<div className="flex justify-center mt-10 text-[14px]">
					<button
						color="gray"
						onClick={onClose}
						className="px-4 py-2 mr-5 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring focus:border-blue-300"
					>
						Cancel
					</button>
					<button
						color="blue"
						onClick={() => handleDeleteCategory(categoryId)}
						className="px-4 py-2 bg-colorDanger dark:bg-colorDanger text-white rounded hover:bg-blue-500 focus:outline-none focus:ring focus:border-blue-300"
					>
						Delete category
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteCategoryModal;
