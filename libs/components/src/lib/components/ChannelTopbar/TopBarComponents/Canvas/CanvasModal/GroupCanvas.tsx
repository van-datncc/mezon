import { selectCanvasEntityById } from "@mezon/store";
import { useSelector } from "react-redux";

type GroupCanvasProps = {
    canvasId: string;
    channelId?: string;
};

const GroupCanvas = ({ canvasId, channelId }: GroupCanvasProps) => {
    const canvas = useSelector((state) => selectCanvasEntityById(state, channelId, canvasId));
    console.log(canvas, 'canvas');
    return (
        <div>
            {/* <div className="mt-2 mb-2 h-6 text-xs font-semibold leading-6 uppercase dark:text-bgLightPrimary text-bgPrimary">{title}</div>
            {children} */}
        </div>
    );
};

export default GroupCanvas;
