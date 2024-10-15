import { canvasActions, createEditCanvas, selectContent, selectCurrentChannelId, selectCurrentClanId, selectTitle } from '@mezon/store';
import 'quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CanvasContent from './CanvasContent';

const Canvas = () => {
    const dispatch = useDispatch();
    const title = useSelector(selectTitle);
    const content = useSelector(selectContent);
    const currentChannelId = useSelector(selectCurrentChannelId);
    const currentClanId = useSelector(selectCurrentClanId);
    const [localTitle, setLocalTitle] = useState(title);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    const callCreateEditCanvas = async () => {
        const body: any = {
            channel_id: currentChannelId,
            clan_id: currentClanId?.toString(),
            content: content || 'aaaa',
            id: null,
            title: localTitle
        };
        await dispatch(createEditCanvas(body) as any);
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
                value={localTitle || ''}
                onChange={handleInputChange}
                className="w-full h-auto px-4 py-2 bg-inherit focus:outline-none text-4xl resize-none overflow-hidden"
            />
            <div className="w-full">
                <CanvasContent isLightMode={true} />
            </div>
        </div>
    );
};

export default Canvas;
