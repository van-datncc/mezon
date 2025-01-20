import { appActions, canvasActions, canvasAPIActions } from '@mezon/store';
import { ShouldRevalidateFunction } from 'react-router-dom';
import { CustomLoaderFunction } from './appLoader';

export const canvasLoader: CustomLoaderFunction = async ({ params, dispatch }) => {
	const { clanId, channelId, canvasId } = params;

	if (!canvasId) {
		throw new Error('Clan ID null');
	}
	const body = {
		channel_id: channelId || '',
		clan_id: clanId || ''
	};
	dispatch(appActions.setIsShowCanvas(true));
	await dispatch(canvasAPIActions.getChannelCanvasList(body));
	dispatch(canvasActions.setIdCanvas(canvasId));
	if (canvasId && channelId && clanId) {
		const body = {
			id: canvasId,
			channel_id: channelId,
			clan_id: clanId
		};
		const results = await dispatch(canvasAPIActions.getChannelCanvasDetail(body));
		const dataUpdate = results?.payload;
		const { content } = dataUpdate;
		dispatch(canvasActions.setContent(content));
		dispatch(canvasAPIActions.updateCanvas({ channelId, dataUpdate }));
	}
	return null;
};

export const shouldRevalidateCanvas: ShouldRevalidateFunction = (ctx : any) => {
	const { currentParams, nextParams } = ctx;

	const { canvasId: currentCanvasId } = currentParams;
	const { canvasId: nextCanvaslId } = nextParams;

	return currentCanvasId !== nextCanvaslId;
};
