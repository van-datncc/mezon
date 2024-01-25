import { ThunkDispatch } from '@reduxjs/toolkit';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, channelsActions, useAppDispatch } from '@mezon/store';
import { useChat } from '@mezon/core';
import { ApiCreateChannelDescRequest } from 'vendors/mezon-js/packages/nakama-js/dist/api.gen';
import * as Icons from '../Icons';
import { ChannelLableModal } from './ChannelLabel';
import { ChannelNameTextFieldModal } from './ChannelNameTextField';
import { ChannelTypeComponent } from './ChannelType';
import { ChannelStatusModal } from './ChannelStatus';
import { CreateChannelButton } from './CreateChannelButton';

export const CreateNewChannelModal = (
  paramCategory: ApiCreateChannelDescRequest,
) => {
  const isOpenModal = useSelector(
    (state: RootState) => state.channels.isOpenCreateNewChannel,
  );
  const { currentClanId } = useChat();

  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    console.log('currentClanId', currentClanId);
    console.log('currentCategoryId', paramCategory.category_id);
    // const body: ApiCreateChannelDescRequest = {
    //   clan_id: "093b8667-1ce3-4982-9140-790dfebcf3c9",
    //   type: 1,
    //   channel_lable: "Vinh-Office2",
    //   channel_private: 1,
    //   category_id:"6829a1f4-9c68-4283-9670-f160a2fc832f"
    // };

    // Handle form submission, e.g., send data to a server or perform any required action

    // dispatch(channelsActions.createNewChannel(body));
  };

  return (
    <>
      {/* {isOpenModal && (
        <CreateChannelModal/>
      )} */}
      <div className="w-[100%] h-[100%] absolute top-0 z-50 ml-[-72px] overflow-x-hidden opacity-90 bg-black flex flex-row justify-center items-center">
        <div className="z-10 Frame397 w-[684px] h-[780px] bg-neutral-900 rounded-2xl flex-col justify-start items-start gap-3 inline-flex flex-col">
          <div className="Frame398 self-stretch h-96 flex-col justify-start items-start flex ">
            <div className="Frame395 self-stretch h-96 px-5 pt-8 pb-5 flex-col justify-start items-start gap-6 flex">
              <div className="self-stretch h-14 flex-col justify-center items-start gap-1 flex">
                <div className="flex items-center justify-between w-full relative">
                  <div className="text-white text-xl flex-nowrap font-bold font-['Manrope']">
                    Create Channel
                  </div>
                  <div className="absolute right-1 top-[-10px]">
                    <button className="hover:text-[#ffffff]">
                      <Icons.Close />
                    </button>
                  </div>
                </div>

                <div className=" text-zinc-400 text-sm font-normal font-['Manrope']">
                  Kindly set up a channel of your choice.
                </div>
              </div>

              <div className="Frame407 self-stretch h-80 flex-col justify-start items-start gap-4 flex">
                <ChannelLableModal labelProp="CHANNEL TYPE" />
                <div className="Frame405 self-stretch h-72 flex-col justify-start items-start gap-2 flex">
                  <ChannelTypeComponent type={0} />
                  <ChannelTypeComponent type={1} />
                  <ChannelTypeComponent type={2} />
                  <ChannelTypeComponent type={3} />
                </div>
              </div>
              <ChannelNameTextFieldModal
                type={1}
                channelNameProps="WHAT IS CHANNEL'S NAME?"
              />
              <ChannelStatusModal channelNameProps="IS PRIVATE CHANNEL?" />
              <CreateChannelButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
