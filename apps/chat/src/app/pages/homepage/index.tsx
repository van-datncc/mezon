import { selectTheme } from '@mezon/store';
import { Image } from '@mezon/ui';
import { useSelector } from 'react-redux';
import Background from "../../../assets/homepage-bg.png";
function Homepage() {
	return (
		<div className='relative'>
			<img src={Background} alt="" className='absolute top-0 z-0 w-full'/>
			<div className="layout relative z-10 flex justify-center">
				<div className="container w-9/12">
					<div className="header text-textDarkTheme mt-5">
						<div className="left flex gap-[10px] items-center">
							<Image
								src={`assets/images/mezon-logo-black.svg`}
								alt={'logoMezon'}
								width={48}
								height={48}
								className="w-10 aspect-square object-cover"
							/>
							<div className='uppercase font-semibold'>Mezon</div>
						</div>
						<div className="mid">
							<div>Download</div>
							<div>Nitro</div>
							<div>Discovery</div>
							<div>Safety</div>
							<div>Support</div>
							<div>Blog</div>
							<div>Careers</div>
						</div>
						<div className="right">Open Mezon</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Homepage;
