import React, { useRef, useState } from 'react';
import { MessageAudioControl } from './MessageAudioControl';
import { MessageAudioUI } from './MessageAudioUI';

type MessageAudioProps = {
	audioUrl: string;
};

export const MessageAudio: React.FC<MessageAudioProps> = React.memo(({ audioUrl }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState<number>(0);
	const audioControlRef = useRef<{ togglePlay: () => void }>(null);

	const handleTogglePlay = () => {
		if (audioControlRef.current) {
			audioControlRef.current.togglePlay();
		}
	};

	return (
		<>
			<MessageAudioControl
				ref={audioControlRef}
				audioUrl={audioUrl}
				setDuration={setDuration}
				setCurrentTime={setCurrentTime}
				setIsPlaying={setIsPlaying}
				isPlaying={isPlaying}
			/>
			<MessageAudioUI isPlaying={isPlaying} currentTime={currentTime} duration={duration} togglePlay={handleTogglePlay} />
		</>
	);
});
