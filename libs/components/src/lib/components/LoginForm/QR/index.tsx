export const QRSection: React.FC = () => {
	return (
		<div className="flex flex-col justify-start items-center w-fit h-fit p-0 gap-y-7 rounded-none">
			<div className="w-[200px] h-[200px] flex items-center justify-center relative">
				<img src={'/assets/Images/QR-mezon.png'} className="rounded-[8px] border-[4px] border-[#ffffff]" alt="Mezon Logo" />
				<div className="absolute flex items-center justify-center">
					<img src={'/assets/Images/mezon-logo.png'} className="w-12 h-12" alt="QR Code" />
				</div>
			</div>
			<div className="flex flex-col justify-start items-center w-[210px] h-fit p-0 gap-y-1">
				<p className="font-manrope text-base font-medium text-[#ffffff] leading-[150%]">Sign in by QR code</p>
				<p className="font-manrope text-sm font-normal text-[#cccccc] leading-[130%]">Use Mezon on mobile to scan QR</p>
			</div>
		</div>
	);
};
