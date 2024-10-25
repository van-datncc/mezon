import { useAuth } from '@mezon/core';
import { appActions, canvasActions, canvasAPIActions, selectCanvasEntityById, selectIdCanvas, useAppDispatch } from '@mezon/store';
import { useSelector } from 'react-redux';

type GroupCanvasProps = {
	canvasId: string;
	channelId?: string;
	clanId: string;
	creatorIdChannel?: string;
	onClose: () => void;
};

const GroupCanvas = ({ canvasId, channelId, clanId, onClose, creatorIdChannel }: GroupCanvasProps) => {
	const canvas = useSelector((state) => selectCanvasEntityById(state, channelId, canvasId));
	const currentIdCanvas = useSelector(selectIdCanvas);
	const { userProfile } = useAuth();
	const dispatch = useAppDispatch();
	const isDisableDelCanvas = Boolean(
		canvas.creator_id && canvas.creator_id !== userProfile?.user?.id && creatorIdChannel !== userProfile?.user?.id
	);

	const handleOpenCanvas = async () => {
		dispatch(appActions.setIsShowCanvas(true));
		dispatch(canvasActions.setIdCanvas(canvasId));
		onClose();
		if (canvasId && channelId && clanId) {
			const body = {
				id: canvasId,
				channel_id: channelId,
				clan_id: clanId
			};
			const results = await dispatch(canvasAPIActions.getChannelCanvasDetail(body));
			const dataUpdate = results?.payload;
			dispatch(canvasAPIActions.updateCanvas({ channelId, dataUpdate }));
		}
	};

	const handleDeleteCanvas = async () => {
		if (canvasId && channelId && clanId) {
			const body = {
				id: canvasId,
				channel_id: channelId,
				clan_id: clanId
			};
			const results = await dispatch(canvasAPIActions.deleteCanvas(body));
			dispatch(canvasAPIActions.removeOneCanvas({ channelId, canvasId }));
			if (currentIdCanvas === canvasId) {
				dispatch(appActions.setIsShowCanvas(false));
			}
		}
	};

	return (
		<div className="w-full flex gap-2">
			<div
				className="w-full p-4 cursor-pointer rounded-lg dark:bg-bgPrimary bg-bgLightPrimary border border-transparent dark:hover:border-bgModifierHover hover:border-bgModifierHover hover:bg-bgLightModeButton"
				onClick={handleOpenCanvas}
				role="button"
			>
				<div className="h-6 text-xs one-line font-semibold leading-6 dark:text-bgLightPrimary text-bgPrimary">
					{canvas.title ? canvas.title : 'Untitled'}
				</div>
			</div>

			<button
				className={`flex-1 p-4 cursor-pointer rounded-lg ${isDisableDelCanvas ? 'bg-red-400' : 'bg-colorDanger hover:bg-colorDangerHover border border-transparent dark:hover:border-bgModifierHover hover:border-bgModifierHover'}`}
				onClick={handleDeleteCanvas}
				disabled={isDisableDelCanvas}
			>
				<div className="h-6 text-xs font-semibold leading-6 dark:text-bgLightPrimary text-bgPrimary">Delete</div>
			</button>
		</div>
	);
};

export default GroupCanvas;
