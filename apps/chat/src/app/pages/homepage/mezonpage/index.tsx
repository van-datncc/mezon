import { Icons } from '@mezon/components';
import { version } from '@mezon/package-js';
import { getPlatform } from '@mezon/utils';
import { useEffect, useMemo, useState } from 'react';
import { HeaderMezon } from './header';
import { OurFeatures } from './layouts/OurFeatures';
import { SideBarMezon } from './sidebar';

function MezonPage() {
	const [sideBarIsOpen, setSideBarIsOpen] = useState(false);
	const [backgroundImage, setBackgroundImage] = useState({ url: '', position: '' });

	const platform = getPlatform();

	const toggleSideBar = () => {
		setSideBarIsOpen(!sideBarIsOpen);
	};

	const downloadUrl: string = useMemo(() => {
		if (platform === 'MacOS') {
			return `https://cdn.mezon.vn/release/mezon-${version}-mac-arm64.zip`;
		} else if (platform === 'Linux') {
			return `https://cdn.mezon.vn/release/mezon-${version}-linux-amd64.deb`;
		}
		return `https://cdn.mezon.vn/release/mezon-${version}-win-x64.exe`;
	}, [platform]);

	const updateBackgroundImage = () => {
		if (window.innerWidth < 768) {
			setBackgroundImage({ url: 'url(../../../assets/hero-header-bg-mobile.png)', position: 'center top' });
		} else {
			setBackgroundImage({ url: 'url(../../../assets/hero-header-bg-desktop.png)', position: 'center' });
		}
	};

	const backgroundImageStyle = {
		backgroundImage: backgroundImage.url,
		backgroundRepeat: 'no-repeat',
		backgroundPosition: backgroundImage.position
	};

	const scrollToSection = (id: string, event: React.MouseEvent) => {
		event.preventDefault();

		const section = document.getElementById(id);
		if (!section) return;

		const offset = window.innerWidth <= 768 ? 72 : 80;
		const sectionTop = section.getBoundingClientRect().top + window.scrollY - offset;

		setSideBarIsOpen(false);

		window.scrollTo({
			behavior: 'smooth',
			top: sectionTop
		});
	};

	useEffect(() => {
		updateBackgroundImage();
		window.addEventListener('resize', updateBackgroundImage);

		return () => window.removeEventListener('resize', updateBackgroundImage);
	}, []);

	return (
		<div className="relative" style={{ background: '#0B0E2D', fontFamily: 'Inter' }}>
			<div
				className="layout relative flex flex-col items-center text-textDarkTheme"
				style={{
					background: 'linear-gradient(219.23deg, #030320 -15.28%, #0F0F63 49.98%, #04041C 115.23%)'
				}}
			>
				<HeaderMezon sideBarIsOpen={sideBarIsOpen} toggleSideBar={toggleSideBar} scrollToSection={scrollToSection} />

				<div className="container w-10/12 max-lg:w-full max-md:px-[16px] max-md:mt-[72px]" id="home">
					<div className="pb-[36px] max-md:mt-[36px] md:py-[120px] flex flex-col gap-[48px] max-md:gap-[32px]" style={backgroundImageStyle}>
						<div className="flex flex-col items-center justify-center gap-[24px] m-auto text-center w-full max-w-full md:max-w-[662px]">
							<h1
								style={{ fontFamily: 'Poppins' }}
								className="tracking-[-.02em] text-center text-[60px] max-md:text-[36px] font-black leading-[72px] max-md:leading-[48px] font-semibold text-[#F4F7F9] max-md:text-[#FFFFFF]"
							>
								Your clan & your world
							</h1>
							<div className="text-[20px] text-[#C2D5DF] text-center leading-[30px] font-normal hidden md:block">
								<div>Mezon is great for playing games and chilling with friends, </div>
								<div>or even building a worldwide community.</div>
								<div>Customize your own space to talk, play, and hang out.</div>
							</div>
						</div>
						<div className="flex justify-center items-center gap-[12px]">
							<a className="" href="https://apps.apple.com/vn/app/mezon/id6502750046" target="_blank" rel="noreferrer">
								<Icons.AppStoreBadge className="max-md:w-[96px]" />
							</a>
							<a className="" href="https://play.google.com/store/apps/details?id=com.mezon.mobile" target="_blank" rel="noreferrer">
								<Icons.GooglePlayBadge className="max-md:w-[108px]" />
							</a>
							<a className="" href={downloadUrl} target="_blank" rel="noreferrer">
								<Icons.MicrosoftBadge className="max-md:w-[108px]" />
							</a>
						</div>
					</div>
				</div>

				{sideBarIsOpen && <SideBarMezon sideBarIsOpen={sideBarIsOpen} toggleSideBar={toggleSideBar} scrollToSection={scrollToSection} />}
			</div>

			<OurFeatures sideBarIsOpen={sideBarIsOpen} />
		</div>
	);
}

export default MezonPage;
