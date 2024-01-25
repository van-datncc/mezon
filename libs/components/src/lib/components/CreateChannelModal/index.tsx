import { ThunkDispatch } from '@reduxjs/toolkit';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  RootState,
  channelsActions,
  useAppDispatch,
  createNewChannel,
} from '@mezon/store';
import { useChat } from '@mezon/core';

import { ApiCreateChannelDescRequest } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';
import * as Icons from '../Icons';
import { ChannelLableModal } from './ChannelLabel';
import { ChannelNameTextField } from './ChannelNameTextField';
import { ChannelTypeComponent } from './ChannelType';
import { ChannelStatusModal } from './ChannelStatus';
import { CreateChannelButton } from './CreateChannelButton';

export const CreateNewChannelModal = () => {
  const { currentClanId } = useChat();

  const currentCategoryId = useSelector(
    (state: RootState) => state.channels.currentCategoryId,
  );
  const isOpenModal = useSelector(
    (state: RootState) => state.channels.isOpenCreateNewChannel,
  );

  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    const body: ApiCreateChannelDescRequest = {
      clan_id: currentClanId?.toString(),
      type: channelType,
      channel_lable: channelName,
      channel_private: isPrivate,
      category_id: currentCategoryId,
    };
    dispatch(createNewChannel(body));
    dispatch(channelsActions.openCreateNewModalChannel());
  };

  const handleCloseModal = () => {
    dispatch(channelsActions.openCreateNewModalChannel());
  };

  const [channelName, setChannelName] = useState('');
  const handleChannelNameChange = (value: string) => {
    setChannelName(value);
  };

  const [channelType, setChannelType] = useState<number>(-1);
  const onChangeChannelType = (value: number) => {
    setChannelType(value);
  };
  const [isPrivate, setIsPrivate] = useState<number>(0);
  const onChangeToggle = (value: number) => {
    setIsPrivate(value);
  };

  return (
    <>
      {isOpenModal && (
        <div className="w-screen h-screen overflow-hidden duration-500 absolute top-0 left-0 z-50 opacity-95 bg-black flex flex-row justify-center items-center">
          <div className="z-60 Frame397 w-[684px] h-[780px] bg-[#151515] rounded-2xl flex-col justify-start items-start gap-3 inline-flex">
            <div className="Frame398 self-stretch h-96 flex-col justify-start items-start flex ">
              <div className="Frame395 self-stretch h-96 px-5 pt-8 pb-5 flex-col justify-start items-start gap-6 flex">
                <div className="self-stretch h-14 flex-col justify-center items-start gap-1 flex">
                  <div className="flex items-center justify-between w-full relative">
                    <div className="text-white text-xl flex-nowrap font-bold font-['Manrope']">
                      Create Channel
                    </div>
                    <div className="absolute right-1 top-[-10px]">
                      <button
                        onClick={handleCloseModal}
                        className="hover:text-[#ffffff]"
                      >
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
                    <ChannelTypeComponent
                      type={0}
                      onChange={onChangeChannelType}
                    />
                    <ChannelTypeComponent
                      type={1}
                      onChange={onChangeChannelType}
                    />
                    <ChannelTypeComponent
                      type={2}
                      onChange={onChangeChannelType}
                    />
                    <ChannelTypeComponent
                      type={3}
                      onChange={onChangeChannelType}
                    />
                  </div>
                </div>
                <ChannelNameTextField
                  onChange={handleChannelNameChange}
                  type={1}
                  channelNameProps="WHAT IS CHANNEL'S NAME?"
                />
                <ChannelStatusModal
                  onChangeValue={onChangeToggle}
                  channelNameProps="IS PRIVATE CHANNEL?"
                />
                <div className=" relative border-black self-stretch px-5 pt-5 pb-8 bg-[#151515] border-t justify-end items-center gap-3 inline-flex">
                  <div className=" flex-col justify-center items-center inline-flex">
                    <div className=" w-[85px] flex-col justify-center items-center gap-2 flex">
                      <div className=" self-stretch grow shrink basis-0 px-4 py-3 rounded flex-col justify-center items-center flex">
                        <div className=" justify-start items-center gap-2 inline-flex">
                          <button
                            onClick={handleCloseModal}
                            className=" text-blue-300 text-base font-medium font-['Manrope'] leading-normal"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" flex-col justify-center items-center inline-flex">
                    <div className=" w-[150px] flex-col justify-center items-center gap-2 flex">
                      <div className=" self-stretch grow shrink basis-0 px-4 py-3  bg-blue-600 rounded flex-col justify-center items-center flex">
                        <div className=" justify-start items-center gap-2 inline-flex">
                          <button
                            onClick={handleSubmit}
                            className="Text text-white text-base font-medium font-['Manrope'] leading-normal"
                          >
                            Create Channel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
