import { Icons, Menu } from '@mezon/ui';
import type { ReactElement, ReactNode } from 'react';
import React, { useMemo } from 'react';

type DeviceSelectorProps = {
	deviceList: MediaDeviceInfo[];
	currentDevice: MediaDeviceInfo | null;
	icon: ReactNode;
	onSelectDevice: (deviceId: string) => Promise<void>;
};

const DeviceSelector: React.FC<DeviceSelectorProps> = ({ deviceList, currentDevice, icon, onSelectDevice }) => {
	const menu = useMemo(() => {
		const menuItems: ReactElement[] = [];
		deviceList.map((device) =>
			menuItems.push(
				<div
					key={device.deviceId}
					className={`px-4 py-3 hover:bg-neutral-700 w-full cursor-pointer flex gap-3 justify-between items-center transition-colors duration-200`}
					onClick={() => onSelectDevice(device.deviceId)}
				>
					<div className={'flex flex-col flex-1 justify-start'}>
						<div className={'text-white font-medium text-sm'}>{device.label}</div>
						<div className={'text-neutral-400 text-xs'}>System Default</div>
					</div>
					<Icons.ArrowRight defaultSize={'w-4 h-4'} defaultFill1={'rgba(249,249,249,1)'} />
				</div>
			)
		);
		return <>{menuItems}</>;
	}, [deviceList]);
	return (
		<Menu menu={menu} className={'rounded-lg bg-neutral-800 border border-neutral-700 shadow-lg min-w-[280px]'}>
			<div className="flex items-center h-full rounded-lg cursor-pointer hover:bg-neutral-600 transition-colors duration-200 px-3">
				{icon}
				{deviceList.length && <div className="w-full h-fit px-2 overflow-hidden whitespace-nowrap text-ellipsis truncate text-white"></div>}
			</div>
		</Menu>
	);
};

export default DeviceSelector;
