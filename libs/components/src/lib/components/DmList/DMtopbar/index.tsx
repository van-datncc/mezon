import { IChannel } from '@mezon/utils';
import * as Icons from '../../Icons/index';
// import { ChannelLable, ThreadLable, SearchMessage } from './TopBarComponents';
export type ChannelTopbarProps = {
    channel?: IChannel | null;
};

function DmTopbar({ channel }: ChannelTopbarProps) {
    return (
        <div className="flex  h-heightTopBar min-w-0 items-center bg-bgSecondary border-b border-black px-3 pt-4 pb-6 flex-shrink ">
            {/* <div className="justify-start items-center gap-1 flex">
                <ChannelLable
                    type={Number(channel?.type)}
                    name={channel?.channel_lable}
                    isPrivate={channel?.channel_private}
                />
            </div> */}

        </div>
    );
}

export default DmTopbar;
