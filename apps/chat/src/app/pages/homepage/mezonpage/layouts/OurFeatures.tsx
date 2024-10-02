import { Icons } from '@mezon/components';
import { Image } from '@mezon/ui';
import { memo } from 'react';

type OurFeatureProps = {
	sideBarIsOpen: boolean;
};

export const OurFeatures = memo((props: OurFeatureProps) => {
	const { sideBarIsOpen } = props;
	return (
		<section
			id="features"
			className="flex flex-col items-center"
			style={{
				background: 'linear-gradient(219.23deg, #030320 -15.28%, #0F0F63 49.98%, #04041C 115.23%)'
			}}
		>
			<div
				className={`w-10/12 max-lg:w-full max-lg:px-[32px] max-md:px-[16px] py-[96px] max-md:py-[48px] ${sideBarIsOpen ? 'unset' : 'relative'} overflow-hidden`}
			>
				<h2
					style={{ fontFamily: 'Poppins' }}
					className="tracking-[-.02em] text-center font-semibold text-[36px] leading-[44px] text-[#F4F7F9]"
				>
					Our features
				</h2>

				<div className="mt-[64px] max-md:mt-[32px] flex flex-col gap-[48px]">
					<div
						className="rounded-[20px] border p-[64px] bg-[#0B0E2D] border-[#4465FF4D] flex flex-col gap-[52px] max-md:rounded-[12px] max-md:py-[32px] max-md:px-[16px] max-md:gap-[20px]"
						style={{ boxShadow: '0px 4px 90px 16px #22119280 inset' }}
					>
						<h3
							className="text-[30px] font-semibold leading-[38px] text-center max-md:text-[20px] max-md:leading-[30px] px-[20px]"
							style={{
								background: 'linear-gradient(#1D5AFA, #F8E4F0)',
								WebkitBackgroundClip: 'text',
								backgroundClip: 'text',
								color: 'transparent',
								fontFamily: 'Poppins'
							}}
						>
							Comprehensive Communication Tools
						</h3>
						<IconGrid />
					</div>

					<div className={`flex flex-col gap-[48px] ${sideBarIsOpen ? 'unset' : 'relative'}`}>
						<div className="flex max-md:flex-wrap gap-[48px] w-full">
							<div
								className="w-[50%] flex flex-col max-md:w-full rounded-[20px] border border-[#4465FF4D] p-[64px] pb-0 h-fit gap-[40px] max-md:py-[32px] max-md:px-[16px] max-md:rounded-[12px] max-md:gap-[20px] max-md:bg-[#0B0E2D]"
								style={{ background: 'linear-gradient(142.48deg, #0A052C 44.04%, #221192 124.62%)' }}
							>
								<h3
									className="text-[30px] font-semibold leading-[38px] text-center max-md:text-[20px] max-md:leading-[30px]"
									style={{
										background: 'linear-gradient(349.47deg, #1D5AFA -9.25%, #F8E4F0 90.24%)',
										WebkitBackgroundClip: 'text',
										backgroundClip: 'text',
										color: 'transparent',
										fontFamily: 'Poppins'
									}}
								>
									Decentralized <br></br> Token-Based Economy
								</h3>
								<Image src={`../../../assets/multiple-block.png`} alt={'blockDecentralized'} />
							</div>

							<div
								className="w-[50%] flex flex-col max-md:w-full rounded-[20px] border border-[#4465FF4D] p-[64px] pb-0 gap-[40px] max-md:py-[32px] max-md:px-[16px] max-md:rounded-[12px] max-md:gap-[20px] max-md:bg-[#0B0E2D]"
								style={{ background: 'linear-gradient(192.5deg, #0A052C 27.1%, #221192 137.4%)' }}
							>
								<h3
									className="text-[30px] font-semibold leading-[38px] text-center max-md:text-[20px] max-md:leading-[30px]"
									style={{
										background: 'linear-gradient(349.47deg, #1D5AFA -9.25%, #F8E4F0 90.24%)',
										WebkitBackgroundClip: 'text',
										backgroundClip: 'text',
										color: 'transparent',
										fontFamily: 'Poppins'
									}}
								>
									Advanced Developer <br></br> API Platform
								</h3>
								<div
									className={`${sideBarIsOpen ? 'unset' : 'relative'}`}
									style={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'center',
										width: '100%'
									}}
								>
									<Image src={`../../../assets/multiple-conversation-reply.png`} alt={'conversationReply'} />
								</div>
							</div>
						</div>

						<div className="flex max-md:flex-wrap gap-[48px] w-full">
							<div
								className={`w-[50%] flex flex-col max-md:w-full rounded-[20px] border border-[#4465FF4D] p-[64px] gap-[40px] max-md:py-[32px] max-md:px-[16px] max-md:rounded-[12px] max-md:gap-[20px] max-md:bg-[#0B0E2D] ${sideBarIsOpen ? 'unset' : 'relative'}`}
								style={{ background: 'linear-gradient(38.57deg, #0A052C 47.53%, #221192 124.01%)' }}
							>
								<h3
									className="text-[30px] font-semibold leading-[38px] text-center max-md:text-[20px] max-md:leading-[30px]"
									style={{
										background: 'linear-gradient(349.47deg, #1D5AFA -9.25%, #F8E4F0 90.24%)',
										WebkitBackgroundClip: 'text',
										backgroundClip: 'text',
										color: 'transparent',
										fontFamily: 'Poppins'
									}}
								>
									Gaming & Entertainment
								</h3>
								<div className="flex flex-col gap-[23px] max-md:gap-[12px] max-md:items-center">
									<div
										className="p-[16px] border border-[#4465FF4D] rounded-[8px] max-md:rounded-[6.67px] max-md:p-[13.33px] border-[0.83px] bg-[#0A052C] w-fit"
										style={{ boxShadow: '0px 4px 24px 16px rgba(34, 17, 146, 0.4) inset' }}
									>
										<span className="font-normal text-[20px] leading-[28px] text-[#92B8FF] max-md:text-[16.67px] max-md:leading-[23.33px]">
											Game Rooms & Channels
										</span>
									</div>
									<div
										className="p-[16px] border border-[#4465FF4D] rounded-[8px] max-md:rounded-[6.67px] max-md:p-[13.33px] border-[0.83px] bg-[#0A052C] w-fit"
										style={{ boxShadow: '0px 4px 24px 16px rgba(34, 17, 146, 0.4) inset' }}
									>
										<span className="font-normal text-[20px] leading-[28px] text-[#92B8FF] max-md:text-[16.67px] max-md:leading-[23.33px]">
											Developer-Driven Game Creation
										</span>
									</div>
									<div
										className="p-[16px] border border-[#4465FF4D] rounded-[8px] max-md:rounded-[6.67px] max-md:p-[13.33px] border-[0.83px] bg-[#0A052C] w-fit"
										style={{ boxShadow: '0px 4px 24px 16px rgba(34, 17, 146, 0.4) inset' }}
									>
										<span className="font-normal text-[20px] leading-[28px] text-[#92B8FF] max-md:text-[16.67px] max-md:leading-[23.33px]">
											Token-Driven Gaming Economy
										</span>
									</div>
								</div>
								<Image
									src={`../../../assets/cube.png`}
									alt={'cube'}
									className="absolute bottom-[0] right-[0] max-md:bottom-[0] max-md:left-[0] max-md:w-[100px] max-md:h-[100px]"
								/>
								<Image
									src={`../../../assets/sword.png`}
									alt={'sword'}
									className="absolute md:top-[25%] right-[0] max-md:bottom-[0] max-md:right-[0] max-md:w-[95px] max-md:h-[95px]"
								/>
							</div>

							<div
								className="w-[50%] flex flex-col items-center max-md:w-full rounded-[20px] border border-[#4465FF4D] p-[64px] gap-[40px] max-md:py-[32px] max-md:px-[16px] max-md:rounded-[12px] max-md:gap-[20px] max-md:bg-[#0B0E2D] max-md:shadow-[0px_4px_90px_16px_#22119280_inset] max-md:bg-[#0B0E2D]"
								style={{ background: 'linear-gradient(315.97deg, #0A052C 52.65%, #221192 113.54%)' }}
							>
								<h3
									className="text-[30px] font-semibold leading-[38px] text-center max-md:text-[20px] max-md:leading-[30px]"
									style={{
										background: 'linear-gradient(349.47deg, #1D5AFA -9.25%, #F8E4F0 90.24%)',
										WebkitBackgroundClip: 'text',
										backgroundClip: 'text',
										color: 'transparent',
										fontFamily: 'Poppins'
									}}
								>
									Customizable & Scalable <br></br> Platform
								</h3>
								<div className="flex flex-col gap-[12px] p-[19.23px] rounded-[12px] border border-[#445FA34D] bg-[#0D0935] max-md:border-[1.2px] max-w-[241.39px]">
									<div className="font-semibold text-[12.38px] text-center leading-[14.85px] text-[#FFFFFF]">
										Customize Your Clan
									</div>
									<span className="font-normal text-[9.9px] leading-[11.88px] text-center text-[#FFFFFF]">
										Give your new clan a personality with a name and an icon. You can always change it later.
									</span>
									<div className="flex justify-center">
										<Icons.UploadImageIcon />
									</div>
									<div className="flex flex-col gap-[4.95px]">
										<span className="font-semibold text-[8.67px] leading-[10.4px] text-[#FFFFFF]">Clan Name</span>
										<div className="flex items-center p-[8.67px] rounded-[4.95px] border-[0.62px] bg-[#1B011A] border-[#535050] h-[27.33px]">
											<span className="font-normal text-[8.67px] leading-[10.4px] text-[#FFFFFF]">adeptus astartes</span>
										</div>
									</div>
									<div className="flex flex-col gap-[4.95px]">
										<span className="font-normal text-[9.9px] leading-[11.88px] text-[#FFFFFF]">
											By creating a clan, you agree to Mezon’s
										</span>
										<span className="font-normal text-[9.9px] leading-[11.88px] text-[#5865F2]">Community Guidelines.</span>
									</div>
									<button className="border-0 p-[7.43px] rounded-[618.32px] bg-[#4477FC] text-center font-semibold text-[11.14px] leading-[13.37px] text-[#FFFFFF]">
										Create Clan
									</button>
								</div>
							</div>
						</div>

						{!sideBarIsOpen && (
							<div
								className="md:block"
								style={{
									position: 'absolute',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
									width: '400px',
									height: '400px',
									background: '#8D72C5',
									opacity: '0.01',
									borderRadius: '50%'
								}}
							></div>
						)}
					</div>
				</div>

				{!sideBarIsOpen && (
					<div>
						<div
							className="hidden max-md:block"
							style={{
								position: 'absolute',
								top: 0,
								right: '50%',
								width: '400px',
								height: '400px',
								background: '#8D72C5',
								opacity: '0.02',
								borderRadius: '50%'
							}}
						></div>

						<div
							className="hidden max-md:block"
							style={{
								position: 'absolute',
								bottom: 0,
								right: '50%',
								width: '400px',
								height: '400px',
								background: '#8D72C5',
								opacity: '0.02',
								borderRadius: '50%'
							}}
						></div>

						<div
							className="hidden max-md:block"
							style={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								width: '400px',
								height: '400px',
								background: '#8D72C5',
								opacity: '0.02',
								borderRadius: '50%'
							}}
						></div>
					</div>
				)}
			</div>
		</section>
	);
});

interface IconCardProps {
	icon: JSX.Element;
	label: string;
}

const IconCard: React.FC<IconCardProps> = ({ icon, label }) => {
	return (
		<div
			className="flex items-center gap-[16px] p-[16px] border rounded-[8px] bg-[#0A052C] border-[#4465FF4D] w-fit max-md:rounded-[5px] max-md:border-[0.63px] max-md:p-[10px] h-[64px] max-md:h-[40px]"
			style={{ boxShadow: '0px 4px 24px 16px #22119266 inset' }}
		>
			{icon}
			<span className="font-normal leading-[37.33px] text-[24px] text-[#92B8FF] max-md:text-[15px] max-md:leading-[23.33px] whitespace-nowrap">
				{label}
			</span>
		</div>
	);
};

const IconGrid: React.FC = () => {
	const items = [
		{ icon: <Icons.MessageSquareIcon className="max-md:w-5" />, label: 'Text' },
		{ icon: <Icons.VoiceIcon className="max-md:w-5" />, label: 'Voice' },
		{ icon: <Icons.VideoIcon className="max-md:w-5" />, label: 'Video' },
		{ icon: <Icons.UserIcon className="max-md:w-5" />, label: 'Customizable roles & permissions' },
		{ icon: <Icons.Bell className="w-8 max-md:w-5 text-[#92B8FF]" />, label: 'Notification management' },
		{ icon: <Icons.PrivateChatIcon className="max-md:w-5" />, label: 'Private messaging' }
	];

	return (
		<div className="flex items-center justify-center flex-wrap gap-[23px] max-md:gap-[12px]">
			{items.map((item, index) => (
				<IconCard key={index} icon={item.icon} label={item.label} />
			))}
		</div>
	);
};
