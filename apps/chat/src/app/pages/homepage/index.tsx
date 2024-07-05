import { Icons } from '@mezon/components';
import { Image } from '@mezon/ui';
import { Link } from 'react-router-dom';
import BannerImg from '../../../assets/homepage-banner.png';
import Background from '../../../assets/homepage-bg.png';
import { useSelector } from 'react-redux';
import { selectIsLogin } from '@mezon/store';

function Homepage() {
	const isLogin = useSelector(selectIsLogin);
	return (
		<div className="relative">
			<img src={Background} alt="" className="absolute top-0 z-0 w-full" />
			<div className="layout relative z-10 flex justify-center text-textDarkTheme">
				<div className="container w-10/12">
					<div className="header mt-5 flex items-center justify-between">
						<Link to={'/mezon'} className="left flex gap-[10px] items-center">
							<Image
								src={`assets/images/mezon-logo-black.svg`}
								alt={'logoMezon'}
								width={48}
								height={48}
								className="w-10 aspect-square object-cover"
							/>
							<div className="uppercase font-bold tracking-wide text-[20px]">Mezon</div>
						</Link>

						<div className="mid flex gap-[40px] items-center font-semibold">
							<div className="hover:underline cursor-pointer">Download</div>
							<div className="hover:underline cursor-pointer">Nitro</div>
							<div className="hover:underline cursor-pointer">Discover</div>
							<div className="hover:underline cursor-pointer">Safety</div>
							<div className="hover:underline cursor-pointer">Support</div>
							<div className="hover:underline cursor-pointer">Blog</div>
							<div className="hover:underline cursor-pointer">Careers</div>
						</div>
						<Link className="right px-[16px] py-[7px] bg-white rounded-3xl text-black font-semibold hover:text-[#5865f2]" to={'/mezon'}>
							{isLogin ? "Open Mezon" : "Login"}
						</Link>
					</div>
					<div className="main-content">
						<div className="block1 flex items-center justify-center">
							<div className="b1-left">
								<div className="top-text text-[50px] font-black leading-[60px]">GROUP CHAT THAT’S ALL FUN & GAMES</div>
								<div className="bottom-text text-[24px]">
									Mezon is great for playing games and chilling with friends, or even building a worldwide community. Customize your
									own space to talk, play, and hang out.
								</div>
							</div>
							<img src={BannerImg} alt="" className="object-cover w-6/12" />
						</div>
						<div className="block2 flex justify-center gap-[24px] mt-10">
							<div
								style={{ borderRadius: '28px' }}
								className="flex items-center text-black bg-white px-[32px] py-[16px] text-[20px] font-semibold leading-[24px] cursor-pointer"
							>
								<Icons.HomepageDownload className="text-black" />
								<div>Download for Windows</div>
							</div>
							<Link
								to={"/mezon"}
								className="text-white bg-[#161cbb] px-[32px] py-[16px] text-[20px] font-semibold leading-[24px]"
								target="_blank"
								rel="noreferrer"
								style={{ borderRadius: '28px' }}
							>
								Open Mezon in your browser
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Homepage;
