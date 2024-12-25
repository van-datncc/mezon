import { getBlobDuration } from '@mezon/utils';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

type AudioControlProps = {
	audioUrl: string;
	setDuration: (duration: number) => void;
	setCurrentTime: (currentTime: number) => void;
	setIsPlaying: (isPlaying: boolean) => void;
	isPlaying: boolean;
};

export const MessageAudioControl = forwardRef((props: AudioControlProps, ref) => {
	const { audioUrl, setDuration, setCurrentTime, setIsPlaying, isPlaying } = props;
	// const [isPlaying, setIsPlaying] = useState(false);
	const audioRef = useRef<HTMLAudioElement>(null);

	useImperativeHandle(ref, () => ({
		togglePlay: () => {
			if (!audioRef.current) return;
			if (isPlaying) {
				audioRef.current.pause();
				setIsPlaying(false);
			} else {
				audioRef.current
					.play()
					.then(() => setIsPlaying(true))
					.catch((error) => {
						console.error('Error while playing audio:', error);
					});
			}
		}
	}));

	const handleTimeUpdate = () => {
		if (audioRef.current) {
			setCurrentTime(audioRef.current.currentTime);
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
		const abortController = new AbortController();

		try {
			const response = await fetch(audioUrl, { signal: abortController.signal });
			const blob = await response.blob();
			const duration = await getBlobDuration(blob);
			setDuration(Math.floor(duration));
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') return;
			console.error('Error fetching audio:', error, audioUrl);
		}

		return () => {
			abortController.abort();
		};
	};

	useEffect(() => {
		const cleanup = getAudioDuration();

		return () => {
			cleanup.then((cleanupFn) => cleanupFn?.());
		};
	}, [audioUrl]);

	return <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" onTimeUpdate={handleTimeUpdate} />;
});
