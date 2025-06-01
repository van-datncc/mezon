import { appActions } from '@mezon/store';
import { ShouldRevalidateFunction } from 'react-router-dom';
import { CustomLoaderFunction } from './appLoader';

export const canvasLoader: CustomLoaderFunction = async ({ params, dispatch }) => {
	const { canvasId } = params;

	if (!canvasId) {
		throw new Error('Clan ID null');
	}
	dispatch(appActions.setIsShowCanvas(true));

	return null;
};

export const shouldRevalidateCanvas: ShouldRevalidateFunction = (ctx) => {
	const { currentParams, nextParams } = ctx;

	const { canvasId: currentCanvasId } = currentParams;
	const { canvasId: nextCanvaslId } = nextParams;

	return currentCanvasId !== nextCanvaslId;
};
