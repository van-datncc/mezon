import { Icons } from '@mezon/ui';
import React from 'react';
import QRCode from 'react-qr-code';

export const QRSection: React.FC<{ loginId: string; isExpired: boolean; reloadQR: () => void }> = ({ loginId, isExpired, reloadQR }) => {
	return (
		<div className="hidden flex-col justify-start items-center w-fit h-fit p-0 gap-y-7 rounded-none lg:flex">
			<div className="relative w-[200px] h-[200px] rounded-[8px] border-[12px] border-[#ffffff]">
				<div className={`w-full h-full flex items-center justify-center ${isExpired ? 'opacity-50 filter blur-md' : 'opacity-100'}`}>
					<QRCode size={150} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} value={loginId} viewBox={`0 0 256 256`} />
				</div>
				{isExpired && (
					<div className="absolute inset-0 flex items-center justify-center">
						<div onClick={reloadQR} className="cursor-pointer">
							<Icons.ReloadIcon />
						</div>
					</div>
				)}
			</div>
			<div className="flex flex-col justify-start items-center w-[210px] h-fit p-0 gap-y-1">
				<p className="text-base font-medium dark:text-[#ffffff] text-black leading-[150%]">Sign in by QR code</p>
				<p className="text-sm font-normal dark:text-[#cccccc] text-black leading-[130%]">Use Mezon on mobile to scan QR</p>
			</div>
		</div>
	);
};
