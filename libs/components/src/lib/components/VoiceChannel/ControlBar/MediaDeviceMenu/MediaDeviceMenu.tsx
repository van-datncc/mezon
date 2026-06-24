import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react';
import { computeMenuPosition, wasClickOutside } from '@livekit/components-core';
import { Icons } from '@mezon/ui';
import type { LocalAudioTrack, LocalVideoTrack } from 'livekit-client';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MediaDeviceSelect } from './MediaDeviceSelect';

export interface MediaDeviceMenuProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	kinds: MediaDeviceKind[];
	initialSelection?: string;
	onActiveDeviceChange?: (kind: MediaDeviceKind, deviceId: string) => void;
	tracks?: Partial<Record<MediaDeviceKind, LocalAudioTrack | LocalVideoTrack | undefined>>;
	requestPermissions?: boolean;
}

export const MediaDeviceMenu = memo(
	({ kinds, initialSelection, onActiveDeviceChange, tracks, requestPermissions = false, ...props }: MediaDeviceMenuProps) => {
		const [isOpen, setIsOpen] = useState(false);
		const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
		const [updateRequired, setUpdateRequired] = useState<boolean>(true);
		const [needPermissions, setNeedPermissions] = useState(requestPermissions);
		const [deviceStates, setDeviceStates] = useState<Record<MediaDeviceKind, { devices: MediaDeviceInfo[]; activeDeviceId: string }>>({
			audioinput: { devices: [], activeDeviceId: 'default' },
			audiooutput: { devices: [], activeDeviceId: 'default' },
			videoinput: { devices: [], activeDeviceId: 'default' }
		});

		const handleActiveDeviceChange = useCallback(
			(kind: MediaDeviceKind, deviceId: string) => {
				setDeviceStates((prev) => ({
					...prev,
					[kind]: {
						...prev[kind],
						activeDeviceId: deviceId
					}
				}));

				onActiveDeviceChange?.(kind, deviceId);
			},
			[onActiveDeviceChange]
		);

		const handleDeviceListChange = useCallback((kind: MediaDeviceKind, devices: MediaDeviceInfo[]) => {
			setDeviceStates((prev) => {
				const currentDevices = prev[kind]?.devices || [];
				if (currentDevices.length === devices.length && currentDevices.every((d, i) => d.deviceId === devices[i]?.deviceId)) {
					return prev;
				}
				return {
					...prev,
					[kind]: {
						...prev[kind],
						devices
					}
				};
			});
			setDevices(devices);
		}, []);

		const getActiveDeviceLabel = (kind: MediaDeviceKind): string => {
			const state = deviceStates[kind];
			if (!state || !state.devices.length) return 'System Default';
			const activeDevice = state.devices.find((d) => d.deviceId === state.activeDeviceId) ?? state.devices[0];
			return activeDevice?.label || 'System Default';
		};

		const button = useRef<HTMLButtonElement>(null);
		const tooltip = useRef<HTMLDivElement>(null);

		useLayoutEffect(() => {
			if (isOpen) {
				setNeedPermissions(true);
			}
		}, [isOpen]);

		useLayoutEffect(() => {
			let cleanup: ReturnType<typeof computeMenuPosition> | undefined;
			if (button.current && tooltip.current && (devices || updateRequired)) {
				cleanup = computeMenuPosition(button.current, tooltip.current, (x, y) => {
					if (tooltip.current) {
						Object.assign(tooltip.current.style, { left: `${x}px`, top: `${y}px` });
					}
				});
			}
			setUpdateRequired(false);
			return () => {
				cleanup?.();
			};
		}, [button, tooltip, devices, updateRequired]);

		const handleClickOutside = useCallback(
			(event: MouseEvent) => {
				if (!tooltip.current) {
					return;
				}
				if (event.target === button.current) {
					return;
				}
				if (isOpen && wasClickOutside(tooltip.current, event)) {
					setIsOpen(false);
				}
			},
			[isOpen, tooltip, button]
		);

		useEffect(() => {
			document.addEventListener<'click'>('click', handleClickOutside);
			return () => {
				document.removeEventListener<'click'>('click', handleClickOutside);
			};
		}, [handleClickOutside]);

		const { t } = useTranslation('channelVoice');

		const targetKinds = useMemo(() => kinds, [kinds]);

		const getLabelForKind = useCallback(
			(k: MediaDeviceKind) => {
				if (k === 'audioinput') return t('device.inputDevice');
				if (k === 'audiooutput') return t('device.outputDevice');
				return t('device.camera');
			},
			[t]
		);

		const handleAudioInputListChange = useCallback(
			(devices: MediaDeviceInfo[]) => handleDeviceListChange('audioinput', devices),
			[handleDeviceListChange]
		);
		const handleAudioOutputListChange = useCallback(
			(devices: MediaDeviceInfo[]) => handleDeviceListChange('audiooutput', devices),
			[handleDeviceListChange]
		);
		const handleVideoInputListChange = useCallback(
			(devices: MediaDeviceInfo[]) => handleDeviceListChange('videoinput', devices),
			[handleDeviceListChange]
		);

		const handleAudioInputChange = useCallback(
			(deviceId: string) => handleActiveDeviceChange('audioinput', deviceId),
			[handleActiveDeviceChange]
		);
		const handleAudioOutputChange = useCallback(
			(deviceId: string) => handleActiveDeviceChange('audiooutput', deviceId),
			[handleActiveDeviceChange]
		);
		const handleVideoInputChange = useCallback(
			(deviceId: string) => handleActiveDeviceChange('videoinput', deviceId),
			[handleActiveDeviceChange]
		);

		const deviceListChangeCallbacks = useMemo<Partial<Record<MediaDeviceKind, (devices: MediaDeviceInfo[]) => void>>>(
			() => ({
				audioinput: handleAudioInputListChange,
				audiooutput: handleAudioOutputListChange,
				videoinput: handleVideoInputListChange
			}),
			[handleAudioInputListChange, handleAudioOutputListChange, handleVideoInputListChange]
		);

		const activeDeviceChangeCallbacks = useMemo<Partial<Record<MediaDeviceKind, (deviceId: string) => void>>>(
			() => ({
				audioinput: handleAudioInputChange,
				audiooutput: handleAudioOutputChange,
				videoinput: handleVideoInputChange
			}),
			[handleAudioInputChange, handleAudioOutputChange, handleVideoInputChange]
		);

		return (
			<>
				<button
					className="lk-button !w-5 !h-5 !p-2 !absolute !bottom-0 !left-[36px] max-md:!left-[26px] max-md:!bottom-[-6px] !rounded-full !border-2 !border-solid bg-zinc-500 dark:bg-zinc-900 !border-zinc-600 dark:border-zinc-950"
					aria-pressed={isOpen}
					{...props}
					ref={button}
					onClick={(e) => {
						e.stopPropagation();
						setIsOpen(!isOpen);
					}}
				>
					{isOpen ? (
						<Icons.VoiceArowUpIcon className="w-4 h-4 bg-white text-black rounded-full" />
					) : (
						<Icons.VoiceArowDownIcon className="w-4 h-4" />
					)}
					{props.children}
				</button>
				{!props.disabled && (
					<div className={`lk-device-menu bottom-0 h-fit !top-auto ${isOpen ? 'visible' : 'invisible'}`} ref={tooltip}>
						{targetKinds.map((k) => {
							const overlay = (
								<div className="rounded-md shadow-lg p-1 min-w-[260px]" style={{ backgroundColor: 'var(--lk-bg2)' }}>
									<MediaDeviceSelect
										initialSelection={deviceStates[k]?.activeDeviceId || initialSelection}
										onActiveDeviceChange={activeDeviceChangeCallbacks[k]}
										onDeviceListChange={deviceListChangeCallbacks[k]}
										kind={k}
										track={tracks?.[k]}
										requestPermissions={needPermissions}
									/>
								</div>
							);

							return (
								<DeviceRow
									key={k}
									menuOpen={isOpen}
									label={getLabelForKind(k)}
									description={getActiveDeviceLabel(k)}
									renderOverlay={() => overlay}
								/>
							);
						})}
					</div>
				)}
			</>
		);
	}
);

interface DeviceRowProps {
	menuOpen: boolean;
	label: string;
	description: string;
	renderOverlay: () => ReactNode;
}

const DeviceRow = memo(({ menuOpen: _menuOpen, label, description, renderOverlay }: DeviceRowProps) => {
	const [open, setOpen] = useState(false);

	const { refs, floatingStyles } = useFloating({
		open,
		placement: 'right-start',
		strategy: 'fixed',
		middleware: [offset(8), flip(), shift({ padding: 8 })],
		whileElementsMounted: autoUpdate
	});

	const handleToggle = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			event.stopPropagation();
			setOpen(!open);
		},
		[open]
	);

	useEffect(() => {
		if (!open) return;

		const handleClickOutside = (event: MouseEvent) => {
			const reference = refs.reference.current as HTMLElement | null;
			const floating = refs.floating.current as HTMLElement | null;

			if (!reference || !floating) return;
			const target = event.target as Node | null;
			if (target && (reference.contains(target) || floating.contains(target))) {
				return;
			}
			setOpen(false);
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [open, refs.reference, refs.floating]);

	useEffect(() => {
		if (!_menuOpen && open) {
			setOpen(false);
		}
	}, [_menuOpen, open]);

	return (
		<>
			<div className="mb-2 last:mb-0">
				<div
					ref={refs.setReference}
					className="relative flex w-[220px] cursor-pointer flex-col rounded-lg bg-zinc-800 dark:bg-zinc-900 px-4 py-3 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-800"
					onClick={handleToggle}
				>
					<div className="flex items-center justify-between">
						<span className="text-sm font-normal text-white leading-5">{label}</span>
					</div>
					<span className="mt-1 text-xs text-zinc-300 dark:text-zinc-400 leading-4 truncate pr-10">{description}</span>
					<Icons.ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300 dark:text-zinc-400" />
				</div>
			</div>
			{open && (
				<div
					ref={refs.setFloating}
					className="rounded-md shadow-lg p-1 min-w-[260px]"
					style={{ ...(floatingStyles as CSSProperties), backgroundColor: 'var(--lk-bg2)' }}
				>
					{renderOverlay()}
				</div>
			)}
		</>
	);
});

export const MICROPHONE_DEVICE_KINDS: MediaDeviceKind[] = ['audioinput', 'audiooutput'];
export const CAMERA_DEVICE_KINDS: MediaDeviceKind[] = ['videoinput'];
