import React from 'react';
import { Link, NavLink } from 'react-router-dom';

interface HeaderProps {
	sideBarIsOpen: boolean;
	toggleSideBar: () => void;
}

const HeaderMezon: React.FC<HeaderProps> = ({ sideBarIsOpen, toggleSideBar }) => {
	return (
		<header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200">
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-center h-16">
					<Link to="/" className="flex items-center">
						<img src="/assets/images/mezon-logo-black.svg" alt="Mezon" className="h-8 w-auto" />
						<span className="ml-2 font-bold text-lg">mezon</span>
					</Link>

					<nav className="hidden md:flex items-center space-x-6">
						<NavLink
							to="/"
							className={({ isActive }) => `font-medium ${isActive ? 'text-[#5865f2]' : 'text-gray-600 hover:text-gray-900'}`}
						>
							Home
						</NavLink>
						<a href="https://mezon.ai/developers/applications" className="font-medium text-gray-600 hover:text-gray-900">
							Developers
						</a>
						<a
							href="https://top.mezon.ai"
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-gray-600 hover:text-gray-900"
						>
							Bots/Apps
						</a>
						<a href="https://mezon.app/docs" className="font-medium text-gray-600 hover:text-gray-900">
							Documents
						</a>
						<NavLink to="/clans" className={({ isActive }) => (isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900')}>
							Clans
						</NavLink>
					</nav>

					<div>
						<a
							href="https://mezon.app/download"
							className="hidden md:inline-block bg-[#5865f2] hover:bg-[#4752c4] text-white px-4 py-2 rounded-full font-medium"
						>
							Download
						</a>

						<button className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100" onClick={toggleSideBar}>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
					</div>
				</div>
			</div>

			{sideBarIsOpen && (
				<div className="md:hidden border-t border-gray-200 bg-white">
					<div className="container mx-auto px-4 py-3 ">
						<nav className="flex flex-col space-y-3">
							<NavLink to="/" className="font-medium text-gray-600 hover:text-gray-900 py-2">
								Home
							</NavLink>
							<a href="https://mezon.app/developers" className="font-medium text-gray-600 hover:text-gray-900 py-2">
								Developers
							</a>
							<a
								href="https://top.mezon.ai"
								target="_blank"
								rel="noopener noreferrer"
								className="font-medium text-gray-600 hover:text-gray-900 py-2"
							>
								Bots/Apps
							</a>
							<a href="https://mezon.app/docs" className="font-medium text-gray-600 hover:text-gray-900 py-2">
								Documents
							</a>
							<NavLink to="/clans" className="font-medium text-gray-600 hover:text-gray-900 py-2">
								Clans
							</NavLink>
							<a
								href="https://mezon.app/download"
								className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-4 py-2 rounded-full font-medium text-center"
							>
								Download
							</a>
						</nav>
					</div>
				</div>
			)}
		</header>
	);
};

export default HeaderMezon;
