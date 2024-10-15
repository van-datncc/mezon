import {
	canvasActions,
	createEditCanvas,
	selectCanvasEntityById,
	selectContent,
	selectCurrentChannelId,
	selectCurrentClanId,
	selectIdCanvas,
	selectTheme,
	selectTitle
} from '@mezon/store';
import 'quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CanvasContent from './CanvasContent';

const Canvas = () => {
	const dispatch = useDispatch();
	const title = useSelector(selectTitle);
	const content = useSelector(selectContent);
	const idCanvas = useSelector(selectIdCanvas);
	const currentChannelId = useSelector(selectCurrentChannelId);
	const currentClanId = useSelector(selectCurrentClanId);
	const canvasById = useSelector((state) => selectCanvasEntityById(state, currentChannelId, idCanvas));
	const [localTitle, setLocalTitle] = useState(title);
	const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
	const appearanceTheme = useSelector(selectTheme);

	const callCreateEditCanvas = async () => {
		if (currentChannelId && currentClanId) {
			const body: any = {
				channel_id: currentChannelId,
				clan_id: currentClanId?.toString(),
				content: content,
				id: canvasById?.id || idCanvas || '',
				title: localTitle
			};
			await dispatch(createEditCanvas(body) as any);
		}
	};

	useEffect(() => {
		setLocalTitle(title);
	}, [title]);

	useEffect(() => {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

		const timer = setTimeout(() => {
			callCreateEditCanvas();
		}, 3000); // Đợi 3 giây

		setDebounceTimer(timer);

		return () => clearTimeout(timer); // Dọn dẹp timer
	}, [localTitle, content]); // Theo dõi cả localTitle và content

	const handleInputChange = (e: { target: { value: any } }) => {
		const newTitle = e.target.value;
		setLocalTitle(newTitle);
		dispatch(canvasActions.setTitle(newTitle));
	};

	return (
		<div className="w-full h-[100vh_-_60px] overflow-auto">
			<textarea
				placeholder="Your canvas title"
				value={canvasById?.title || localTitle || ''}
				style={{ color: appearanceTheme === 'light' ? 'rgb(51, 51, 51)' : 'white' }}
				onChange={handleInputChange}
				className="w-full px-4 py-2 mt-[25px] bg-inherit focus:outline-none text-[28px] resize-none overflow-hidden leading-[34px] font-bold h-[60px] text-inherit"
			/>
			<div className="w-full">
				<CanvasContent isLightMode={true} content={canvasById?.content || ''} />
			</div>
		</div>
	);
};

export default Canvas;
