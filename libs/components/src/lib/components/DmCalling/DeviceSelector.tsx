import { Icons, Menu } from '@mezon/ui';
import React, { ReactElement, ReactNode, useMemo } from 'react';

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
					className={`p-1 rounded-3xl hover:bg-colorTextLightMode w-full cursor-pointer flex gap-2 justify-between items-center ${device.deviceId === currentDevice?.deviceId && 'text-contentBrand'} `}
					onClick={() => onSelectDevice(device.deviceId)}
				>
					<div className={'h-5 w-5 flex justify-center items-center'}>
						{device.deviceId === currentDevice?.deviceId && <Icons.CheckIcon />}
					</div>
					<div className={'flex flex-1 justify-start'}>{device.label}</div>
				</div>
			)
		);
		return <>{menuItems}</>;
	}, [deviceList]);
	return (
		<Menu menu={menu} className={'rounded-3xl'}>
			<div className="flex items-center border border-white h-full rounded-3xl cursor-pointer hover:bg-colorTextLightMode w-[250px]">
				{icon}
				{deviceList.length && (
					<div className="w-full h-fit px-2 overflow-hidden whitespace-nowrap text-ellipsis truncate">{currentDevice?.label || ''}</div>
				)}
			</div>
		</Menu>
	);
};

export default DeviceSelector;
