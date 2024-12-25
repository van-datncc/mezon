import { formatTimeToMMSS, getBlobDuration } from '@mezon/utils';
import { useEffect, useRef, useState } from 'react';

type MessageAudioProps = {
	audioUrl: string;
};

export const MessageAudio: React.FC<MessageAudioProps> = ({ audioUrl }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const audioRef = useRef<HTMLAudioElement>(null);
	const [duration, setDuration] = useState<number>(0);

	const togglePlay = () => {
		if (!audioUrl) {
			console.error('Audio URL is empty or undefined.');
			return;
		}

		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
				setIsPlaying(false);
			} else {
				try {
					audioRef.current.play().catch((error) => {
						console.error('Error while playing audio:', error, audioUrl);
					});
					setIsPlaying(true);
				} catch (error) {
					console.error('Play method failed:', error, audioUrl);
				}
			}
		} else {
			console.error('Audio element is not initialized.');
		}
	};

	const handleTimeUpdate = () => {
		if (audioRef.current) {
			setCurrentTime(audioRef.current?.currentTime);
		}
	};

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleError = (e: Event) => {
			console.error('Audio element encountered an error:', e);
		};

		audio.addEventListener('error', handleError);

		return () => {
			audio.removeEventListener('error', handleError);
		};
	}, [audioUrl]);

	const getAudioDuration = async () => {
		try {
			const response = await fetch(audioUrl);
			const blob = await response.blob();
			const duration = await getBlobDuration(blob);
			setDuration(Math.floor(duration));
		} catch (error) {
			console.error('Error fetching audio:', error, audioUrl);
		}
	};

	useEffect(() => {
		getAudioDuration();
	}, []);

	return (
		<div className="inline-flex items-center justify-between gap-3 bg-bgSelectItem text-white rounded-full py-1.5 pl-1.5 pr-3.5 w-60 will-change-transform">
			<button
				onClick={togglePlay}
				className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-bgSelectItem hover:bg-blue-50 transition-colors"
			>
				{isPlaying ? (
					<svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
						<rect x="6" y="4" width="4" height="16" />
						<rect x="14" y="4" width="4" height="16" />
					</svg>
				) : (
					<svg viewBox="0 0 24 24" className="w-4 h-4 fill-current ml-0.5">
						<path d="M8 5v14l11-7z" />
					</svg>
				)}
			</button>

			<span className="ml-2 text-sm whitespace-nowrap">
				{formatTimeToMMSS(currentTime)} / {formatTimeToMMSS(duration)}
			</span>

			<audio ref={audioRef} src={audioUrl} className="hidden" onEnded={() => setIsPlaying(false)} onTimeUpdate={handleTimeUpdate} />
		</div>
	);
};
