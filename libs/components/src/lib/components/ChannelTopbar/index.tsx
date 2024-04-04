import { ChannelType } from '@mezon/mezon-js';
import { appActions, selectIsShowMemberList } from '@mezon/store';
import { IChannel } from '@mezon/utils';
import { useDispatch, useSelector } from 'react-redux';
import * as Icons from '../Icons';
import NotificationList from '../NotificationList';
import { ChannelLabel, SearchMessage } from './TopBarComponents';

export type ChannelTopbarProps = {
	channel?: IChannel | null;
};

function ChannelTopbar({ channel }: ChannelTopbarProps) {
	const checkChannelType = channel?.type === ChannelType.CHANNEL_TYPE_VOICE;
	return (
		<div
			className={`flex p-3 min-w-0 items-center  flex-shrink h-heightHeader ${checkChannelType ? 'bg-[#1E1E1E]' : 'bg-bgSecondary border-b border-black'}`}
		>
			<div className={`justify-start items-center gap-1 ${checkChannelType ? 'hidden group-hover:flex transition-all duration-300' : 'flex'}`}>
				<ChannelLabel channel={channel} />
			</div>

			{/* Desktop buttons */}
			<div className={`items-center h-full ml-auto ${checkChannelType ? 'hidden group-hover:flex transition-all duration-300' : 'flex'}`}>
				<div className="justify-end items-center gap-2 flex">
					<div className="pr-[70px] hidden ssm:flex">
						<div className="justify-start items-center gap-[15px] flex iconHover">
							<ThreadButton />
							<MuteButton />
							<PinButton />
							<ChannelListButton />
							<ThreeDotButton />
						</div>
						<SearchMessage />
					</div>

					<div
						className={`gap-4 iconHover absolute flex  w-[82px] h-8 justify-center items-center left-[345px] ssm:left-auto ssm:right-0 ${checkChannelType ? 'bg-[#1E1E1E]' : 'bg-[linear-gradient(90deg,_#151515de,_#151515,_#151515)]'}`}
						id="inBox"
					>
						<NotificationList />
						<HelpButton />
					</div>
				</div>
			</div>
		</div>
	);
}

function ThreadButton() {
	return (
		<button>
			<Icons.ThreadIcon />
		</button>
	);
}

function MuteButton() {
	return (
		<button>
			<Icons.MuteBell />
		</button>
	);
}

function PinButton() {
	return (
		<button>
			<Icons.PinRight />
		</button>
	);
}

function ThreeDotButton() {
	return (
		<button>
			<Icons.ThreeDot />
		</button>
	);
}

function InboxButton() {
	return (
		<button>
			<Icons.Inbox />
		</button>
	);
}

function HelpButton() {
	return (
		<button>
			<Icons.Help />
		</button>
	);
}

function ChannelListButton() {
	const dispatch = useDispatch();
	const isActive = useSelector(selectIsShowMemberList);
	const handleClick = () => {
		dispatch(appActions.setIsShowMemberList(!isActive));
	};
	return (
		<button onClick={handleClick}>
			<Icons.MemberList isWhite={isActive} />
		</button>
	);
}

export default ChannelTopbar;
