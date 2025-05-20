import { selectDiscoverClans } from '@mezon/store';
import { FaDiscord, FaFacebook, FaReddit, FaTwitter } from 'react-icons/fa';
import { HiOutlineCalendarDays, HiOutlineChatBubbleLeftRight, HiOutlineLightBulb, HiOutlineUserGroup } from 'react-icons/hi2';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const DEFAULT_BANNER = 'https://avatars.mds.yandex.net/get-altay/2714499/2a00000171f9f3edac1a338e6573cf9da97b/XXXL';
const DEFAULT_LOGO = 'https://play-lh.googleusercontent.com/UPav_gp7_ZAxEiseeV6UMZHGt_Y9vzanriemFsWZgud3S70IPfP4BBVnqIVOk_GR3_U';

export default function ClanDetailPage() {
	const { id } = useParams();
	const clans = useSelector(selectDiscoverClans) || [];
	const clan = clans.find((c: any) => c.clan_id === id);

	if (!clan) {
		return <div className="text-center py-20">Clan not found.</div>;
	}

	const chatty = (clan as any).chatty || 'Like a busy coffee shop';
	const createdAt = (clan as any).created_at || 'January 2nd, 2020';
	const features = [
		(clan as any).feature1 || 'Try out the official features of this clan!',
		(clan as any).feature2 || 'Weekly events and updates.',
		(clan as any).feature3 || 'Chat with other members about real-life projects.',
		(clan as any).feature4 || 'Ask questions and explore tips.'
	];
	const categories = (clan as any).categories || ['Science & Tech', 'Entertainment'];
	const socials = (clan as any).socials || [
		{ icon: <FaDiscord />, url: '#' },
		{ icon: <FaFacebook />, url: '#' },
		{ icon: <FaReddit />, url: '#' },
		{ icon: <FaTwitter />, url: '#' }
	];

	return (
		<div className="max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
			{/* Banner + Logo */}
			<div className="relative h-56 bg-gray-200">
				<img src={clan.banner || DEFAULT_BANNER} alt="banner" className="w-full h-full object-cover" />
				<div className="absolute left-8 -bottom-10 w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-lg overflow-hidden border-4 border-white">
					<img src={clan.clan_logo || DEFAULT_LOGO} alt="logo" className="w-full h-full object-cover" />
				</div>
			</div>
			<div className="pt-14 px-8 pb-8">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div>
						<div className="flex items-center gap-2 mb-2">
							<h1 className="text-2xl font-bold text-gray-900">{clan.clan_name}</h1>
							{clan.verified && (
								<svg className="w-6 h-6 text-[#5865f2]" fill="currentColor" viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									></path>
								</svg>
							)}
						</div>
						<div className="text-gray-600 mb-2">{clan.description || clan.about || 'No description.'}</div>
						<div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
							<div className="flex items-center gap-1">
								<div className="w-2 h-2 rounded-full bg-green-500"></div>
								<span>{clan.online_members?.toLocaleString('en-US') || 0} Online</span>
							</div>
							<span>•</span>
							<span>{clan.total_members?.toLocaleString('en-US') || 0} Members</span>
						</div>
					</div>
					<div className="flex flex-col gap-2 min-w-[160px]">
						<button className="bg-[#5865f2] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#4752c4]">Join Clan</button>
						<button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold">Share Clan</button>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
					<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
						<HiOutlineChatBubbleLeftRight className="w-6 h-6 text-[#5865f2]" />
						<div>
							<div className="font-semibold text-sm">How chatty?</div>
							<div className="text-xs text-gray-500">{chatty}</div>
						</div>
					</div>
					<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
						<HiOutlineCalendarDays className="w-6 h-6 text-[#5865f2]" />
						<div>
							<div className="font-semibold text-sm">Server created</div>
							<div className="text-xs text-gray-500">{createdAt}</div>
						</div>
					</div>
					<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
						<HiOutlineLightBulb className="w-6 h-6 text-[#5865f2]" />
						<div>
							<div className="font-semibold text-sm">Feature</div>
							<div className="text-xs text-gray-500">{features[0]}</div>
						</div>
					</div>
					<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
						<HiOutlineUserGroup className="w-6 h-6 text-[#5865f2]" />
						<div>
							<div className="font-semibold text-sm">Community</div>
							<div className="text-xs text-gray-500">{features[1]}</div>
						</div>
					</div>
				</div>
				<div className="flex flex-wrap items-center justify-between mt-6 gap-4">
					<div className="flex flex-wrap gap-2">
						{categories.map((cat: string, idx: number) => (
							<span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
								{cat}
							</span>
						))}
					</div>
					<div className="flex gap-2">
						{socials.map((s: any, idx: number) => (
							<a
								key={idx}
								href={s.url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-[#5865f2] text-xl"
							>
								{s.icon}
							</a>
						))}
					</div>
				</div>
				<div className="mt-8">
					<h2 className="text-lg font-bold mb-2">About</h2>
					<div className="text-gray-700 text-sm">{clan.about || clan.description || 'No additional information.'}</div>
				</div>
			</div>
		</div>
	);
}
