import { ApiMessageAttachment } from 'mezon-js/api.gen';
import { useRef, useState } from 'react';
import { Icons } from '../../components';

export type MessageImage = {
	readonly attachmentData: ApiMessageAttachment;
};
export const MIN_WIDTH_VIDEO_SHOW = 162;

function MessageVideo({ attachmentData }: MessageImage) {
	const handleOnCanPlay = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
		if (e.currentTarget.offsetWidth < MIN_WIDTH_VIDEO_SHOW) {
			setShowControl(false);
		}
	};
	const videoRef = useRef<HTMLVideoElement>(null);
	const [showControl, setShowControl] = useState(true);

	const handleShowFullVideo = () => {
		if (videoRef.current) {
			videoRef.current.requestFullscreen();
		}
	};
	const handleTogglePlay = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
		if (e.currentTarget.paused) {
			e.currentTarget.play();
		} else {
			e.currentTarget.pause();
		}
	};
	return (
		<div className="relative overflow-hidden w-full h-full max-w-fit rounded-lg">
			<video
				src={attachmentData.url}
				controls={showControl}
				autoPlay={false}
				className={`${showControl ? 'max-w-full h-[150px]' : `w-[${MIN_WIDTH_VIDEO_SHOW}px] h-auto`} object-contain`}
				ref={videoRef}
				onCanPlay={(e) => handleOnCanPlay(e)}
				onClick={(e) => handleTogglePlay(e)}
			></video>
			{!showControl && (
				<div className="bottom-1 right-1 absolute w-4 h-4 rounded overflow-hidden cursor-pointer z-10" onClick={handleShowFullVideo}>
					<Icons.FullScreen className="w-4 h-4 dark:text-[#AEAEAE] text-[#535353] dark:hover:text-white hover:text-black" />
				</div>
			)}
		</div>
	);
}

export default MessageVideo;
