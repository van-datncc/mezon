import { BackgroundBlur, VirtualBackground, supportsBackgroundProcessors, supportsModernBackgroundProcessors } from '@livekit/track-processors';
import { Icons } from '@mezon/ui';
import { LocalParticipant, Track } from 'livekit-client';
import { useEffect, useRef, useState } from 'react';

interface BackgroundEffectsMenuProps {
	participant: LocalParticipant;
}

const darkGradientBackgroundUrl =
	'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiM4MDgwODAiLz4KPC9zdmc+';

export const BackgroundEffectsMenu: React.FC<BackgroundEffectsMenuProps> = ({ participant }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [activeEffect, setActiveEffect] = useState<'none' | 'blur' | 'background'>('none');
	const [isLoading, setIsLoading] = useState(false);
	const [isSupported, setIsSupported] = useState(false);
	const [supportsModern, setSupportsModern] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const currentProcessorRef = useRef<any>(null);

	useEffect(() => {
		const supported = supportsBackgroundProcessors();
		const modern = supportsModernBackgroundProcessors();

		setIsSupported(supported);
		setSupportsModern(modern);

		return () => {
			const videoTrackPublication = participant.getTrackPublication(Track.Source.Camera);
			if (videoTrackPublication?.track) {
				videoTrackPublication.track.stopProcessor().catch(console.error);
			}
		};
	}, [participant]);

	const applyBlur = async () => {
		if (!isSupported) {
			console.error('Background processors are not supported in this browser');
			return;
		}

		setIsLoading(true);

		try {
			const videoTrackPublication = participant.getTrackPublication(Track.Source.Camera);
			if (!videoTrackPublication?.track) {
				setIsLoading(false);
				return;
			}

			await videoTrackPublication.track.stopProcessor();

			const blurProcessor = BackgroundBlur(30);
			currentProcessorRef.current = blurProcessor;

			await videoTrackPublication.track.setProcessor(blurProcessor);

			setActiveEffect('blur');
			setIsOpen(false);
		} catch (error) {
			console.error('Failed to apply blur:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const applyVirtualBackground = async () => {
		if (!isSupported) {
			console.error('Background processors are not supported in this browser');
			return;
		}

		setIsLoading(true);

		try {
			const videoTrackPublication = participant.getTrackPublication(Track.Source.Camera);
			if (!videoTrackPublication?.track) {
				setIsLoading(false);
				return;
			}

			await videoTrackPublication.track.stopProcessor();

			const bgProcessor = VirtualBackground(darkGradientBackgroundUrl);
			currentProcessorRef.current = bgProcessor;

			await videoTrackPublication.track.setProcessor(bgProcessor);

			setActiveEffect('background');
			setIsOpen(false);
		} catch (error) {
			console.error('Failed to apply virtual background:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const removeEffects = async () => {
		setIsLoading(true);

		try {
			const videoTrackPublication = participant.getTrackPublication(Track.Source.Camera);
			if (videoTrackPublication?.track) {
				await videoTrackPublication.track.stopProcessor();
				currentProcessorRef.current = null;
				setActiveEffect('none');
				setIsOpen(false);
			}
		} catch (error) {
			console.error('Failed to remove effects:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	if (!isSupported) {
		return null;
	}

	return (
		<div className="relative" ref={menuRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="absolute bottom-0 right-0 bg-zinc-900 rounded-full p-1 cursor-pointer"
				title="Background effects"
				disabled={isLoading}
			>
				<Icons.SettingProfile className={`w-4 h-4 ${isLoading ? 'text-gray-500' : 'text-white'}`} />
			</button>

			{isOpen && (
				<div className="absolute bottom-12 right-0 bg-zinc-800 rounded-lg p-2 shadow-lg z-50 w-48">
					<div className="text-white text-sm font-medium mb-2">
						Background Effects
						{supportsModern && <span className="ml-2 text-xs text-green-400">Enhanced</span>}
					</div>
					<div className="space-y-2">
						<button
							onClick={applyBlur}
							className={`w-full text-left text-sm px-2 py-1 rounded hover:bg-zinc-700 ${activeEffect === 'blur' ? 'bg-zinc-700 text-white' : 'text-white'}`}
							disabled={isLoading}
						>
							{isLoading && activeEffect === 'blur' ? 'Applying...' : 'Blur Background'}
						</button>
						<button
							onClick={applyVirtualBackground}
							className={`w-full text-left text-sm px-2 py-1 rounded hover:bg-zinc-700 ${activeEffect === 'background' ? 'bg-zinc-700 text-white' : 'text-white'}`}
							disabled={isLoading}
						>
							{isLoading && activeEffect === 'background' ? 'Applying...' : 'Dark Background'}
						</button>
						<button
							onClick={removeEffects}
							className={`w-full text-left text-sm px-2 py-1 rounded hover:bg-zinc-700 ${activeEffect === 'none' ? 'bg-zinc-700 text-white' : 'text-white'}`}
							disabled={isLoading}
						>
							{isLoading && activeEffect === 'none' ? 'Removing...' : 'No Effect'}
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
