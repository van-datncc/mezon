import { Image } from '@mezon/ui';
import { IMessage, IMessageWithUser } from '@mezon/utils';

export type MessageWithUserProps = {
  message: IMessageWithUser;
};

function MessageWithUser({ message }: MessageWithUserProps) {
  return (
    <div className="flex py-0.5 pr-16 pl-4 h-15 mt-3 hover:bg-gray-950/[.07] overflow-x-hidden cursor-pointer">
      <div className=" px-3 justify-start items-start gap-3 inline-flex ">
        <img
          className="w-11 h-11 rounded-full"
          src={message.user?.avatarSm || ''}
          alt={message.user?.username || ''}
        />

        <div className="flex-col justify-center items-start inline-flex">
          <div className="justify-start items-center gap-2 inline-flex">
            <div className="font-thin font-['Manrope'] text-sm  text-green-400">
              {message.user?.username}
            </div>
            <div className="w-full text-zinc-400 text-xs font-['Manrope']">
              {message?.date}
            </div>
          </div>
          <div className="w-[980px] justify-start items-center gap-2 inline-flex">
            <div className=" text-xs text-white font-['Manrope']">
              {message.content?.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageWithUser;
