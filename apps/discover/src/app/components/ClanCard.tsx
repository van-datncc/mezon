import { ApiClanDiscover } from 'mezon-js/api.gen';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_IMAGES } from '../constants/constants';
/**
 * @param clan
 */
interface ClanCardProps {
	clan: ApiClanDiscover;
}

const DEFAULT_BACKGROUND = '#5865f2';

const ClanCard: React.FC<ClanCardProps> = ({ clan }) => {
	const navigate = useNavigate();
	const [bannerError, setBannerError] = useState(false);
	const [logoError, setLogoError] = useState(false);
	const [isLogoLoading, setIsLogoLoading] = useState(true);
	const [isBannerLoading, setIsBannerLoading] = useState(true);

	const formatNumber = (num: number | undefined) => {
		return num?.toLocaleString('en-US') || '0';
	};
	const clanId = clan.clan_id;
	const isValidId = typeof clanId === 'string' && clanId.length > 0;
	const clanName = clan.clan_name || 'Unnamed Clan';

	const handleBannerError = () => {
		setBannerError(true);
	};

	const handleLogoError = () => {
		setLogoError(true);
	};

	return (
		<div
			className="flex bg-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden mb-2"
			onClick={() => navigate(`/clan/${clan.clan_id}`)}
		>
			<div className="flex-shrink-0 w-24 sm:w-40 h-24 sm:h-28 md:w-48 md:h-32 bg-gray-200 flex items-center justify-center">
				{isBannerLoading && <div className="w-full h-full skeleton rounded-l-xl" />}
				<img
					src={clan.banner && !bannerError ? clan.banner : DEFAULT_IMAGES.BANNER}
					alt={`${clanName} banner`}
					className={`w-full h-full object-cover rounded-l-xl ${isBannerLoading ? 'hidden' : ''}`}
					onLoad={() => setIsBannerLoading(false)}
					onError={handleBannerError}
				/>
			</div>
			<div className="flex-1 flex flex-col justify-center px-3 sm:px-4 py-2 sm:py-3 min-w-0">
				<div className="flex items-center gap-2 min-w-0 mb-1">
					<div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center overflow-hidden flex-shrink-0">
						{isLogoLoading && <div className="w-full h-full skeleton rounded-full" />}
						<img
							src={clan.clan_logo && !logoError ? clan.clan_logo : DEFAULT_IMAGES.LOGO}
							alt={`${clanName} logo`}
							className={`w-full h-full object-cover ${isLogoLoading ? 'hidden' : ''}`}
							onLoad={() => setIsLogoLoading(false)}
							onError={handleLogoError}
						/>
					</div>
					<h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 truncate">{clanName}</h3>
				</div>
				<p className="text-xs sm:text-sm text-gray-700 line-clamp-2 mb-1">{clan.description || 'Community clan'}</p>
				<div className="flex items-center text-gray-500 text-[10px] sm:text-xs space-x-2 sm:space-x-3 mb-1">
					<div className="flex items-center">
						<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 mr-1"></div>
						<span>{formatNumber(clan.online_members)} Online</span>
					</div>
					<div className="w-1 h-1 rounded-full bg-gray-300"></div>
					<span>{formatNumber(clan.total_members) || (isValidId ? '100+' : '0')} Members</span>
				</div>
				<div className="mt-1">
					<span
						className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold gap-1 ${clan.verified ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}`}
					>
						<svg
							className={`w-3 h-3 sm:w-4 sm:h-4 ${clan.verified ? 'text-green-500' : 'text-gray-400'}`}
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clipRule="evenodd"
							></path>
						</svg>
						VERIFIED
					</span>
				</div>
			</div>
		</div>
	);
};

export default ClanCard;
