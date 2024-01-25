import * as Icons from '../../Icons';
import { ChannelTypeEnum } from '@mezon/utils';
import React, { useState } from 'react';

interface ChannelTypeProps {
  type: number;
}

export const ChannelTypeComponent: React.FC<ChannelTypeProps> = ({ type }) => {

  return (
    <div className="Frame403 self-stretch px-2 py-3 bg-stone-900 rounded-lg justify-center items-center gap-4 inline-flex">
      <div className="ChannelChat w-6 h-6 relative">
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
      </div>
      <div className="Frame402 grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
        <div className="Text self-stretch text-stone-300 text-base font-bold font-['Manrope'] leading-normal">
          {type === ChannelTypeEnum.TEXT ? (
            <p>Text</p>
          ) : type === ChannelTypeEnum.VOICE ? (
            <p>Voice</p>
          ) : type === ChannelTypeEnum.FORUM ? (
            <p>Forum</p>
          ) : type === ChannelTypeEnum.ANNOUNCEMENT ? (
            <p>Announcement</p>
          ) : (
            ''
          )}
        </div>
        <div className="SendMessagesImagesGifsEmojiOpinionsAndPuns self-stretch text-zinc-400 text-sm font-normal font-['Manrope'] leading-[18.20px]">
          {type === ChannelTypeEnum.TEXT ? (
            <p> Send messages, images, GIFs, emoji, opinions, and puns</p>
          ) : type === ChannelTypeEnum.VOICE ? (
            <p> Hang out together with voice, video, and screen share</p>
          ) : type === ChannelTypeEnum.FORUM ? (
            <p>Create a space for organized discussions</p>
          ) : type === ChannelTypeEnum.ANNOUNCEMENT ? (
            <p>Important updates for people in and out of the server</p>
          ) : (
            ''
          )}
        </div>
      </div>
      <div className="RadioButton p-0.5 justify-start items-start flex">
        <div className="Wrapper w-5 h-5 relative">
          <div className="Plate w-5 h-5 left-0 top-0 absolute justify-start items-start inline-flex">
            <div className="Circle grow shrink basis-0 self-stretch bg-stone-900 rounded-full border border-blue-600" />
          </div>
          <div className="Ellipse w-3 h-3 left-[4px] top-[4px] absolute bg-blue-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
