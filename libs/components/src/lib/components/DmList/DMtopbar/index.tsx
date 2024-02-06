import { IChannel } from '@mezon/utils';
import * as Icons from '../../Icons/index';
import { ChannelLable, SearchMessage } from '../../ChannelTopbar/TopBarComponents';
import { useSelector } from 'react-redux';
import { selectDmGroupCurrent } from '@mezon/store';

export type ChannelTopbarProps = {
	dmGroupId?: string;
};

function DmTopbar({ dmGroupId }: ChannelTopbarProps) {
	const currentDmGroup = useSelector(selectDmGroupCurrent(dmGroupId ?? ''));

	return (
		<div className="flex  h-heightTopBar min-w-0 items-center bg-bgSecondary border-b border-black px-3 pt-4 pb-6 flex-shrink">
			<div className="justify-start items-center gap-1 flex w-full">
				<div className='flex flex-row gap-1 items-center'>
                    <Icons.Hashtag/>
					<h2 className="font-[Manrope] shrink-1 text-white text-ellipsis">{currentDmGroup.channel_lable}</h2>
				</div>

				<div className="hidden items-center h-full ml-auto lg:flex flex-1 justify-end">
					<div className=" items-center gap-2 flex">
						<div className="justify-start items-center gap-[15px] flex">
							<button>
								<Icons.ThreadIcon />
							</button>

							<button>
								<Icons.MuteBell />
							</button>

							<button>
								<Icons.PinRight />
							</button>

							<button>
								<Icons.MemberList />
							</button>

							<button>
								<Icons.ThreeDot />
							</button>
						</div>
						<SearchMessage />
						<div className="justify-start items-start gap-4 flex">
							<button>
								<Icons.Inbox />
							</button>
							<button>
								<Icons.Help />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DmTopbar;
