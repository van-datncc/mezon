import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
	return (
		<footer className="bg-[#23272a] text-white pt-16 pb-8">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
					<div>
						<h3 className="text-[#5865f2] font-bold text-xl mb-4">Mezon</h3>
						<ul className="space-y-2">
							<li>
								<Link to="/" className="text-gray-400 hover:text-white">
									Home
								</Link>
							</li>
							<li>
								<a href="https://mezon.app/download" className="text-gray-400 hover:text-white">
									Download
								</a>
							</li>
							<li>
								<Link to="/clans" className="text-gray-400 hover:text-white">
									Clans
								</Link>
							</li>
							<li>
								<a href="https://mezon.app/safety" className="text-gray-400 hover:text-white">
									Safety
								</a>
							</li>
							<li>
								<a href="https://mezon.app/blog" className="text-gray-400 hover:text-white">
									Blog
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-[#5865f2] font-bold text-xl mb-4">Company</h3>
						<ul className="space-y-2">
							<li>
								<a href="https://mezon.app/about" className="text-gray-400 hover:text-white">
									About
								</a>
							</li>
							<li>
								<a href="https://mezon.app/jobs" className="text-gray-400 hover:text-white">
									Jobs
								</a>
							</li>
							<li>
								<a href="https://mezon.app/branding" className="text-gray-400 hover:text-white">
									Branding
								</a>
							</li>
							<li>
								<a href="https://mezon.app/newsroom" className="text-gray-400 hover:text-white">
									Newsroom
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-[#5865f2] font-bold text-xl mb-4">Resources</h3>
						<ul className="space-y-2">
							<li>
								<a href="https://mezon.app/college" className="text-gray-400 hover:text-white">
									College
								</a>
							</li>
							<li>
								<a href="https://mezon.app/support" className="text-gray-400 hover:text-white">
									Support
								</a>
							</li>
							<li>
								<a href="https://mezon.app/safety" className="text-gray-400 hover:text-white">
									Safety
								</a>
							</li>
							<li>
								<a href="https://mezon.app/blog" className="text-gray-400 hover:text-white">
									Blog
								</a>
							</li>
							<li>
								<a href="https://mezon.app/feedback" className="text-gray-400 hover:text-white">
									Feedback
								</a>
							</li>
							<li>
								<a href="https://mezon.app/developers" className="text-gray-400 hover:text-white">
									Developers
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-[#5865f2] font-bold text-xl mb-4">Policies</h3>
						<ul className="space-y-2">
							<li>
								<a href="https://mezon.app/terms" className="text-gray-400 hover:text-white">
									Terms
								</a>
							</li>
							<li>
								<a href="https://mezon.app/privacy" className="text-gray-400 hover:text-white">
									Privacy
								</a>
							</li>
							<li>
								<a href="https://mezon.app/guidelines" className="text-gray-400 hover:text-white">
									Guidelines
								</a>
							</li>
							<li>
								<a href="https://mezon.app/acknowledgements" className="text-gray-400 hover:text-white">
									Acknowledgements
								</a>
							</li>
							<li>
								<a href="https://mezon.app/licenses" className="text-gray-400 hover:text-white">
									Licenses
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
					<div className="flex items-center mb-4 md:mb-0">
						<Link to="/" className="flex items-center">
							<img src="assets/images/mezon-logo-white.svg" alt="Mezon Logo" className="w-8 h-8 mr-2" />
							<span className="text-white font-semibold text-lg">Mezon</span>
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
