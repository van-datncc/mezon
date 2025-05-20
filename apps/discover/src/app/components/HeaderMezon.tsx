import { selectIsLogin } from '@mezon/store';
import { throttle } from 'lodash';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { BREAKPOINTS, COLORS, NAVIGATION_LINKS, Z_INDEX } from '../constants/constants';

interface HeaderProps {
	sideBarIsOpen: boolean;
	toggleSideBar: () => void;
}

const HeaderMezon = memo((props: HeaderProps) => {
	const isLogin = useSelector(selectIsLogin) ?? false;
	const { sideBarIsOpen, toggleSideBar } = props;
	const refHeader = useRef<HTMLDivElement>(null);
	const [isScrolled, setIsScrolled] = useState(false);

	const handleScroll = useCallback(
		throttle(() => {
			const scrolled = window.scrollY > 50;
			setIsScrolled(scrolled);
		}, 0),
		[]
	);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [handleScroll]);

	useEffect(() => {
		handleScroll();
	}, [sideBarIsOpen, handleScroll]);

	try {
		return (
			<div
				className={`layout fixed flex flex-col items-center w-full ${isScrolled ? 'bg-[#0B0E2D4D] z-[100] shadow-[0px_4px_12px_0px_#0B0E2D26] backdrop-blur-[24px]' : 'z-[100]'} h-[80px] max-md:h-[72px]`}
			>
				<div
					ref={refHeader}
					className={`header fixed z-[${Z_INDEX.HEADER}] w-10/12 max-lg:w-full max-md:border-b-[1px] max-md:border-[${COLORS.BORDER}]`}
				>
					<div className="flex items-center justify-between md:px-[32px] max-md:px-[16px] max-md:py-[14px] h-[80px] max-md:h-[72px]">
						<div className="flex items-center gap-[40px]">
							<Link to={'/'} className="flex items-center gap-[4.92px]">
								<img src="/assets/images/mezon-logo-black.svg" alt="Mezon" className="w-8 h-8 aspect-square object-cover" />
								<div className="font-semibold text-[22.15px] leading-[26.58px] tracking-[0.06em]">mezon</div>
							</Link>
							<div className={`hidden ${BREAKPOINTS.MOBILE}:flex items-center gap-[32px]`}>
								{Object.entries(NAVIGATION_LINKS).map(([key, link]) =>
									key === 'DISCOVER' ? (
										<NavLink
											key={key}
											to={link.url}
											className="border-b-2 border-transparent shadow-none text-[16px] leading-[24px] text-[#7C92AF] font-semibold flex flex-row items-center px-[2px] hover:border-[#8FA7BF] hover:text-[#8FA7BF] focus:border-transparent focus:rounded-lg focus:shadow-[0px_0px_0px_4px_#678FFF]"
										>
											{link.label}
										</NavLink>
									) : (
										<a
											key={key}
											href={link.url}
											target="_blank"
											rel="noopener noreferrer"
											className="border-b-2 border-transparent shadow-none text-[16px] leading-[24px] text-[#7C92AF] font-semibold flex flex-row items-center px-[2px] hover:border-[#8FA7BF] hover:text-[#8FA7BF] focus:border-transparent focus:rounded-lg focus:shadow-[0px_0px_0px_4px_#678FFF]"
										>
											{link.label}
										</a>
									)
								)}
							</div>
						</div>
						<div className="w-fit">
							<Link
								className={`hidden ${BREAKPOINTS.MOBILE}:block px-[16px] py-[10px] bg-[${COLORS.PRIMARY}] rounded-lg text-[#F4F7F9] text-[16px] leading-[24px] hover:bg-[${COLORS.PRIMARY_HOVER}] focus:bg-[#281FB5] whitespace-nowrap`}
								to={'/mezon'}
							>
								{isLogin ? 'Open Mezon' : 'Login'}
							</Link>

							<button
								className={`${BREAKPOINTS.MOBILE}:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100`}
								onClick={toggleSideBar}
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
								</svg>
							</button>
						</div>
					</div>
				</div>

				{sideBarIsOpen && (
					<div
						className={`${BREAKPOINTS.MOBILE}:hidden fixed top-[72px] left-0 right-0 bg-white border-t border-gray-200 z-[${Z_INDEX.MOBILE_MENU}]`}
					>
						<div className="container mx-auto px-4 py-3">
							<nav className="flex flex-col space-y-3">
								{Object.entries(NAVIGATION_LINKS).map(([key, link]) =>
									key === 'DISCOVER' ? (
										<NavLink key={key} to={link.url} className="font-medium text-gray-600 hover:text-gray-900 py-2">
											{link.label}
										</NavLink>
									) : (
										<a key={key} href={link.url} className="font-medium text-gray-600 hover:text-gray-900 py-2">
											{link.label}
										</a>
									)
								)}
								<Link
									to={'/mezon'}
									className={`bg-[${COLORS.PRIMARY}] hover:bg-[${COLORS.PRIMARY_HOVER}] text-white px-4 py-2 rounded-full font-medium text-center`}
								>
									{isLogin ? 'Open Mezon' : 'Login'}
								</Link>
							</nav>
						</div>
					</div>
				)}
			</div>
		);
	} catch (error) {
		console.error('Error rendering header:', error);
		return (
			<div className={`fixed top-0 left-0 right-0 z-[${Z_INDEX.HEADER}] bg-white h-[80px] max-md:h-[72px] border-b border-gray-200`}>
				<div className="container mx-auto flex items-center justify-between px-4 h-full">
					<Link to={'/'} className="flex items-center gap-2">
						<img src="/assets/images/mezon-logo-black.svg" alt="Mezon" className="w-8 h-8" />
						<div className="font-semibold text-xl">mezon</div>
					</Link>
					<div className="w-fit">
						<button
							className={`${BREAKPOINTS.MOBILE}:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100`}
							onClick={toggleSideBar}
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		);
	}
});

export default HeaderMezon;
