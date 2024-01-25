import { ChannelLableModal } from '../ChannelLabel';
import * as Icons from '../../Icons';

interface ChannelStatusModalProps {
  channelNameProps: string;
}

export const ChannelStatusModal: React.FC<ChannelStatusModalProps> = ({
  channelNameProps,
}) => {
  return (
    <div className="Frame348 self-stretch h-[62px] flex-col justify-start items-start gap-3 flex">
      <div className="Frame347 self-stretch justify-start items-center gap-3 inline-flex">
        <div className="Frame409 grow shrink basis-0 h-6 justify-start items-center gap-1 flex">
          <div className="Lock w-6 h-6 relative">
            <div className="LiveArea w-5 h-5 left-[2px] top-[2px] absolute" />
            <Icons.Private/>
          </div>
          <ChannelLableModal labelProp={channelNameProps} />
        </div>
        <div className="ToggleSwitch w-[52px] h-8 relative bg-zinc-400 rounded-[100px]">
          <div className="Ellipse w-7 h-7 left-[2px] top-[2px] absolute bg-white rounded-full" />
        </div>
      </div>
      <div className="OnlySelectedMembersAndRolesWillBeAbleToViewThisChannel self-stretch text-zinc-400 text-sm font-normal font-['Manrope'] leading-[18.20px]">
        Only selected members and roles will be able to view this channel.
      </div>
    </div>
  );
};
