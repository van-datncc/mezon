import { appActions, canvasActions, canvasAPIActions, selectCanvasEntityById, useAppDispatch } from "@mezon/store";
import { useSelector } from "react-redux";

type GroupCanvasProps = {
    canvasId: string;
    channelId?: string;
    clanId: string;
};

const GroupCanvas = ({ canvasId, channelId, clanId }: GroupCanvasProps) => {
    const canvas = useSelector((state) => selectCanvasEntityById(state, channelId, canvasId));
    const dispatch = useAppDispatch();
    console.log(canvas, 'canvas');

    const handleOpenCanvas = async () => {
        dispatch(appActions.setIsShowCanvas(true));
        dispatch(canvasActions.setIdCanvas(canvasId));
        if (canvasId && channelId && clanId) {
            const body = {
                id: canvasId,
                channel_id: channelId,
                clan_id: clanId
            };
            await dispatch(canvasAPIActions.getChannelCanvasDetail(body));
        }

    };

    return (
        <div className="cursor-pointer" onClick={handleOpenCanvas}>
            <div className="mt-2 mb-2 h-6 text-xs font-semibold leading-6 uppercase dark:text-bgLightPrimary text-bgPrimary">
                {canvas.title ? canvas.title : 'Untitled'}
            </div>
        </div>
    );
};

export default GroupCanvas;
