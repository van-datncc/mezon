import { IChannel } from '@mezon/utils';
import * as Icons from '../Icons';
import { ChannelLable, ThreadLable, SearchMessage } from './TopBarComponents';
import { useDispatch } from 'react-redux';
import { toggleIsShow } from '../../../../../store/src/lib/showlistmember/showlistmember.slice';
export type ChannelTopbarProps = {
    channel?: IChannel | null;
};

function ChannelTopbar({ channel }: ChannelTopbarProps) {
    const dispatch = useDispatch();
    const handleClick = () => {
        dispatch(toggleIsShow());
      };
    return (
        <div className="flex p-3 min-w-0 items-center bg-bgSecondary border-b border-black flex-shrink ">
            <div className="justify-start items-center gap-1 flex">
                <ChannelLable
                    type={Number(channel?.type)}
                    name={channel?.channel_lable}
                    isPrivate={channel?.channel_private}
                />
            </div>

            {/* Desktop buttons */}
            <div className="hidden items-center h-full ml-auto lg:flex">
                <div className="justify-end items-center gap-2 flex">
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

                        <button onClick={handleClick}>
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
    );
}

export default ChannelTopbar;
