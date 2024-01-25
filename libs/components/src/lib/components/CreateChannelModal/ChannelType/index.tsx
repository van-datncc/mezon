import * as Icons from '../../Icons';
import { ChannelTypeEnum } from '@mezon/utils';
import React, { useState } from 'react';

interface ChannelTypeProps {
  type: number;
  onChange: (value: number) => void;
}

const iconMap = {
  [ChannelTypeEnum.TEXT]: <Icons.Hashtag defaultSize="w-6 h-6" />,
  [ChannelTypeEnum.VOICE]: <Icons.Speaker defaultSize="w-6 h-6" />,
  [ChannelTypeEnum.FORUM]: <Icons.Forum defaultSize="w-6 h-6" />,
  [ChannelTypeEnum.ANNOUNCEMENT]: <Icons.Announcement defaultSize="w-6 h-6" />,
};

const labelMap = {
  [ChannelTypeEnum.TEXT]: 'Text',
  [ChannelTypeEnum.VOICE]: 'Voice',
  [ChannelTypeEnum.FORUM]: 'Forum',
  [ChannelTypeEnum.ANNOUNCEMENT]: 'Announcement',
};

const descriptionMap = {
  [ChannelTypeEnum.TEXT]:
    'Send messages, images, GIFs, emoji, opinions, and puns',
  [ChannelTypeEnum.VOICE]:
    'Hang out together with voice, video, and screen share',
  [ChannelTypeEnum.FORUM]: 'Create a space for organized discussions',
  [ChannelTypeEnum.ANNOUNCEMENT]:
    'Important updates for people in and out of the server',
};

export const ChannelTypeComponent: React.FC<ChannelTypeProps> = ({
  type,
  onChange,
}) => {
  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="Frame403 self-stretch px-2 py-3 bg-stone-900 rounded-lg justify-center items-center gap-4 inline-flex hover:bg-stone-800">
      <div className="ChannelChat w-6 h-6 relative">
        {iconMap[type as ChannelTypeEnum]}
      </div>
      <div className="Frame402 grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
        <div className="Text self-stretch text-stone-300 text-base font-bold font-['Manrope'] leading-normal">
          <p>{labelMap[type as ChannelTypeEnum]}</p>
        </div>
        <div className="SendMessagesImagesGifsEmojiOpinionsAndPuns self-stretch text-zinc-400 text-sm font-normal font-['Manrope'] leading-[18.20px]">
          <p>{descriptionMap[type as ChannelTypeEnum]}</p>
        </div>
      </div>
      <div className="RadioButton p-0.5 justify-start items-start flex">
        <div className="relative flex items-center">
          <input
            className="w-4 h-4 transition-colors bg-white border-2 rounded-full appearance-none cursor-pointer peer border-white checked:border-[#0A68FF] checked:bg-[#0A68FF] checked:hover:border-[#0A68FF] checked:hover:bg-[#0A68FF] focus:outline-none checked:focus:border-[#0A68FF] checked:focus:white focus-visible:outline-none disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50"
            type="radio"
            value={type}
            id={type.toString()}
            name="drone"
            onChange={onValueChange}
          />
        </div>
      </div>
    </div>
  );
};
