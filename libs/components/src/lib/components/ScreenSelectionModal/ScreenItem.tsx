import { voiceActions } from '@mezon/store';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

type ScreenItemsProps = {
	id: string;
	name: string;
	thumbnail: string;
	onClose?: () => void;
};

const ScreenItems = ({ id, name, thumbnail, onClose }: ScreenItemsProps) => {
	const dispatch = useDispatch();

	const selectStreamScreen = useCallback(async () => {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: false,
			video: {
				mandatory: {
					chromeMediaSource: 'desktop',
					chromeMediaSourceId: id
				}
			}
		} as MediaStreamConstraints);
		dispatch(voiceActions.setShowSelectScreenModal(false));
		dispatch(voiceActions.setStreamScreen(stream));
		dispatch(voiceActions.setShowScreen(true));
		onClose?.();
	}, [id, dispatch, onClose]);
	return (
		<div onClick={() => selectStreamScreen()}>
			<img src={thumbnail} alt={thumbnail} />
			<p>{name}</p>
		</div>
	);
};

export default ScreenItems;
