import { Icons, Image } from '@mezon/ui';
import { Platform, getPlatform } from '@mezon/utils';
import { useEffect, useRef, useState } from 'react';
import { DropdownButton } from '..';
interface FooterProps {
	downloadUrl: string;
	universalUrl: string;
	portableUrl: string;
}
const Footer = ({ downloadUrl, universalUrl, portableUrl }: FooterProps) => {
	const platform = getPlatform();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const trackFooterDownloadEvent = (platform: string, downloadType: string) => {
		if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
			(window as any).gtag('event', 'download_click', {
				event_category: 'Footer Downloads',
				event_label: platform,
				download_type: downloadType,
				custom_parameter_1: 'mezon_footer'
			});
		}
	};

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div>
			<div className="bg-white relative flex flex-col items-center bg-no-repeat">
				<div className="flex h-16 w-full bg-[url(assets/title.png)] items-center justify-center">
					<div className="flex items-center gap-2 justify-center">
						<Image src={`assets/logo.png`} width={120} height={35} className="object-cover" />
					</div>
				</div>
				<div className="pb-[48px] pt-[20px] flex flex-col w-10/12 max-lg:w-full">
					<div className="w-full px-[32px] max-md:px-[16px] flex justify-between gap-[48px] flex-col sm:items-center">
						<div className="flex justify-between gap-[48px] flex-col sm:px-20 md:px-40">
							<div className="flex gap-[32px] max-sm:flex-col items-center justify-center">
								<span
									className="text-[26px] leading-[30px] font-normal text-center bg-gradient-to-r from-[#7E00FF] via-[#E16AFF] to-[#4191FF] 
            bg-clip-text text-transparent"
								>
									Mezon is great for playing games and chilling <br /> with friends, or even building a worldwide <br /> community.{' '}
								</span>
							</div>
							<div className="flex gap-[32px] max-sm:flex-col justify-center">
								<div className="flex flex-col gap-[12px]">
									<a
										href="https://mezon.ai/blogs/executive-summary"
										className="pr-[2px] pl-[2px] text-xl max-md:text-lg max-sm:text-base font-semibold text-[#474747]"
										target="_blank"
										rel="noreferrer"
									>
										Executive Summary
									</a>
									<a
										href="https://mezon.ai/blogs/problem-statement"
										className="pr-[2px] pl-[2px] text-xl max-md:text-lg max-sm:text-base font-semibold text-[#474747]"
										target="_blank"
										rel="noreferrer"
									>
										Problem Statement
									</a>
									<a
										href="https://mezon.ai/blogs/solution"
										className="pr-[2px] pl-[2px] text-xl max-md:text-lg max-sm:text-base font-semibold text-[#474747]"
										target="_blank"
										rel="noreferrer"
									>
										Solution
									</a>
									<a
										href="https://mezon.ai/blogs/blockchain-economy"
										className="pr-[2px] pl-[2px] text-xl max-md:text-lg max-sm:text-base font-semibold text-[#474747]"
										target="_blank"
										rel="noreferrer"
									>
										Blockhain & Token Economy
									</a>
									<a
										href="https://mezon.ai/developers"
										className="pr-[2px] pl-[2px] text-xl max-md:text-lg max-sm:text-base font-semibold text-[#474747]"
										target="_blank"
										rel="noreferrer"
									>
										Developer API Integration
									</a>
								</div>
								<div className="flex flex-col gap-[12px]">
									<a
										href="https://mezon.ai/blogs/technica-architecture"
										target="_blank"
										rel="noreferrer"
										className="pr-[2px] pl-[2px] text-xl max-md:text-lg max-sm:text-base font-semibold text-[#474747]"
									>
										Technical Architecture
									</a>
									<a
										href="https://mezon.ai/blogs/readmap"
										className="pr-[2px] pl-[2px] text-xl max-md:text-lg max-sm:text-base font-semibold text-[#474747]"
										target="_blank"
										rel="noreferrer"
									>
										Product roadmap
									</a>
									<a
										href="https://mezon.ai/blogs/tokenomics"
										className="pr-[2px] pl-[2px] text-xl max-md:text-lg max-sm:text-base font-semibold text-[#474747]"
										target="_blank"
										rel="noreferrer"
									>
										{' '}
										Tokenomics
									</a>
									<a
										href="https://mezon.ai/blogs/team"
										className="pr-[2px] pl-[2px] text-xl max-md:text-lg max-sm:text-base font-semibold text-[#474747]"
										target="_blank"
										rel="noreferrer"
									>
										Team
									</a>
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-[16px]">
							<div className="flex gap-[16px] max-sm:flex-col">
								<a
									href="https://apps.apple.com/vn/app/mezon/id6502750046"
									target="_blank"
									rel="noreferrer"
									onClick={() => trackFooterDownloadEvent('iOS', 'App Store')}
								>
									<Image src={`assets/app-store.svg`} className="max-w-[135px]" />
								</a>
								<a
									href="https://play.google.com/store/apps/details?id=com.mezon.mobile"
									target="_blank"
									rel="noreferrer"
									onClick={() => trackFooterDownloadEvent('Android', 'Google Play')}
								>
									<Image src={`assets/google-play.svg`} className="max-w-[135px]" />
								</a>{' '}
								{platform === Platform.MACOS ? (
									<div className="relative inline-block leading-[0px]" ref={dropdownRef}>
										<button onClick={toggleDropdown}>
											<Icons.MacAppStoreDesktop className="max-w-full h-[40px] w-fit" />
										</button>

										{isOpen && (
											<div className="absolute mt-[8px]">
												<a
													className="cursor-pointer leading-[0px] block"
													href={downloadUrl}
													target="_blank"
													rel="noreferrer"
													onClick={() => trackFooterDownloadEvent('macOS', 'Apple Silicon')}
												>
													<Icons.MacAppleSilicon className="max-w-full h-[40px] w-fit" />
												</a>
												<a
													className="cursor-pointer leading-[0px] block mt-[4px]"
													href={universalUrl}
													target="_blank"
													rel="noreferrer"
													onClick={() => trackFooterDownloadEvent('macOS', 'Intel')}
												>
													<Icons.MacAppleIntel className="max-w-full h-[40px] w-fit" />
												</a>
											</div>
										)}
									</div>
								) : platform === 'Linux' ? (
									<a
										className="cursor-pointer"
										href={downloadUrl}
										target="_blank"
										rel="noreferrer"
										onClick={() => trackFooterDownloadEvent('Linux', 'DEB Package')}
									>
										<Image src={`assets/linux.svg`} className="max-w-[135px]" />
									</a>
								) : (
									<DropdownButton
										icon={
											<a
												className="cursor-pointer"
												href={downloadUrl}
												target="_blank"
												rel="noreferrer"
												onClick={() => trackFooterDownloadEvent('Windows', 'EXE Installer')}
											>
												<Icons.MicrosoftDropdown className="max-w-full h-[40px] w-fit" />
											</a>
										}
										downloadLinks={[
											{
												url: portableUrl,
												icon: <Icons.MicrosoftWinPortable className="max-w-full h-[40px] max-md:w-fit" />,
												trackingData: { platform: 'Windows', type: 'Portable' }
											}
										]}
										dropdownRef={dropdownRef}
										downloadUrl={downloadUrl}
										onDownloadClick={trackFooterDownloadEvent}
									/>
								)}
							</div>
						</div>
						<div>
							<span className="text-lg font-normal text-[#474747]">© 2024 Mezon. All rights reserved.</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Footer;
