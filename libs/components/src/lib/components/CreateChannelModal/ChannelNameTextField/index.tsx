import { ChannelTypeEnum } from '@mezon/utils';
import { ChannelLableModal } from '../ChannelLabel';
import * as Icons from '../../Icons';

interface ChannelNameModalProps {
  type: number;
  channelNameProps: string;
}

export const ChannelNameTextFieldModal: React.FC<ChannelNameModalProps> = ({
  channelNameProps,
  type,
}) => {
  return (
    <div className="Frame408 self-stretch h-[84px] flex-col justify-start items-start gap-4 flex mt-4">
      <ChannelLableModal labelProp={channelNameProps} />

      <div className="ContentContainer self-stretch h-11 flex-col items-start flex">
        <div className="InputContainer self-stretch h-11 px-4 py-3 bg-neutral-950 rounded shadow border w-full border-blue-600 justify-start items-center gap-2 inline-flex">
          {type === ChannelTypeEnum.TEXT ? (
            <Icons.Hashtag defaultSize="w-6 h-6" />
          ) : type === ChannelTypeEnum.VOICE ? (
            <Icons.Speaker defaultSize="w-6 h-6" />
          ) : type === ChannelTypeEnum.FORUM ? (
            <Icons.Forum defaultSize="w-6 h-6" />
          ) : type === ChannelTypeEnum.ANNOUNCEMENT ? (
            <Icons.Announcement defaultSize="w-6 h-6" />
          ) : (
            []
          )}
          <div className="InputValue grow shrink basis-0 self-stretch justify-start items-center flex">
            <input className="Input grow shrink basis-0 h-10 outline-none bg-neutral-950 text-neutral-200 text-sm font-normal font-['Manrope']"></input>
          </div>
        </div>
      </div>
    </div>
  );
};
