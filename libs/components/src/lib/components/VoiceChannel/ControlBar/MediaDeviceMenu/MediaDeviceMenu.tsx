import { computeMenuPosition, log, wasClickOutside } from '@livekit/components-core';
import { MediaDeviceSelect } from '@livekit/components-react';
import type { LocalAudioTrack, LocalVideoTrack } from 'livekit-client';
import { ButtonHTMLAttributes, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface MediaDeviceMenuProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	kind?: MediaDeviceKind;
	initialSelection?: string;
	onActiveDeviceChange?: (kind: MediaDeviceKind, deviceId: string) => void;
	tracks?: Partial<Record<MediaDeviceKind, LocalAudioTrack | LocalVideoTrack | undefined>>;
	requestPermissions?: boolean;
}

export function MediaDeviceMenu({
	kind,
	initialSelection,
	onActiveDeviceChange,
	tracks,
	requestPermissions = false,
	...props
}: MediaDeviceMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
	const [updateRequired, setUpdateRequired] = useState<boolean>(true);
	const [needPermissions, setNeedPermissions] = useState(requestPermissions);

	const handleActiveDeviceChange = (kind: MediaDeviceKind, deviceId: string) => {
		log.debug('handle device change');
		setIsOpen(false);
		onActiveDeviceChange?.(kind, deviceId);
	};

	const button = useRef<HTMLButtonElement>(null);
	const tooltip = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (isOpen) {
			setNeedPermissions(true);
		}
	}, [isOpen]);

	useLayoutEffect(() => {
		if (button.current && tooltip.current && (devices || updateRequired)) {
			computeMenuPosition(button.current, tooltip.current).then(({ x, y }) => {
				if (tooltip.current) {
					Object.assign(tooltip.current.style, { left: `${x}px`, top: `${y - 36}px` });
				}
			});
		}
		setUpdateRequired(false);
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
		window.addEventListener<'resize'>('resize', () => setUpdateRequired(true));
		return () => {
			document.removeEventListener<'click'>('click', handleClickOutside);
			window.removeEventListener<'resize'>('resize', () => setUpdateRequired(true));
		};
	}, [handleClickOutside, setUpdateRequired]);

	return (
		<>
			<button
				className="lk-button lk-button-menu !w-5 !h-5 !p-2 !absolute !bottom-0 !left-[36px] !rounded-full !border-2 !border-solid !border-[#111]"
				aria-pressed={isOpen}
				{...props}
				onClick={() => setIsOpen(!isOpen)}
				ref={button}
			>
				{props.children}
			</button>
			{!props.disabled && (
				<div className="lk-device-menu" ref={tooltip} style={{ visibility: isOpen ? 'visible' : 'hidden' }}>
					{kind ? (
						<MediaDeviceSelect
							initialSelection={initialSelection}
							onActiveDeviceChange={(deviceId) => handleActiveDeviceChange(kind, deviceId)}
							onDeviceListChange={setDevices}
							kind={kind}
							track={tracks?.[kind]}
							requestPermissions={needPermissions}
						/>
					) : (
						<>
							<div className="lk-device-menu-heading">Audio inputs</div>
							<MediaDeviceSelect
								kind="audioinput"
								onActiveDeviceChange={(deviceId) => handleActiveDeviceChange('audioinput', deviceId)}
								onDeviceListChange={setDevices}
								track={tracks?.audioinput}
								requestPermissions={needPermissions}
							/>
							<div className="lk-device-menu-heading">Video inputs</div>
							<MediaDeviceSelect
								kind="videoinput"
								onActiveDeviceChange={(deviceId) => handleActiveDeviceChange('videoinput', deviceId)}
								onDeviceListChange={setDevices}
								track={tracks?.videoinput}
								requestPermissions={needPermissions}
							/>
						</>
					)}
				</div>
			)}
		</>
	);
}
