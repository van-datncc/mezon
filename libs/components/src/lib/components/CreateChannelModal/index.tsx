import React, { useEffect, useState } from 'react';
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
import { AlertTitleTextWarning } from 'libs/ui/src/lib/Alert';
import { Type } from 'libs/utils/src/lib/typings/index';

export const CreateNewChannelModal = () => {
  const { currentClanId } = useChat();
  const currentCategoryId = useSelector(
    (state: RootState) => state.channels.currentCategoryId,
  );
  const isOpenModal = useSelector(
    (state: RootState) => state.channels.isOpenCreateNewChannel,
  );

  const isLoading = useSelector(
    (state: RootState) => state.channels.loadingStatus,
  );

  console.log("loadding", isLoading)

  const dispatch = useAppDispatch();
  const [isErrorType, setIsErrorType] = useState<string>('');
  const [isErrorName, setIsErrorName] = useState<string>('');

  const handleSubmit = async () => {
    if (channelType === -1) {
      setIsErrorType("Channel's type is required");
      return;
    }
    if (channelName === '') {
      setIsErrorName("Channel's name is required");
      return;
    }

    const body: ApiCreateChannelDescRequest = {
      clan_id: currentClanId?.toString(),
      type: Type.CHANNEL,
      channel_lable: channelName,
      channel_private: isPrivate,
      category_id: currentCategoryId,
    };
    await dispatch(createNewChannel(body));
    clearDataAfterCreateNew();
    dispatch(channelsActions.openCreateNewModalChannel());
  };

  const handleCloseModal = () => {
    setIsErrorType('');
    setIsErrorName('');
    clearDataAfterCreateNew();
    dispatch(channelsActions.openCreateNewModalChannel());
  };

  const [channelName, setChannelName] = useState('');
  const handleChannelNameChange = (value: string) => {
    setIsErrorName('');
    setChannelName(value);
  };

  const [channelType, setChannelType] = useState<number>(-1);
  const onChangeChannelType = (value: number) => {
    setIsErrorType('');
    setChannelType(value);
  };
  const [isPrivate, setIsPrivate] = useState<number>(0);
  const onChangeToggle = (value: number) => {
    setIsPrivate(value);
  };

  const clearDataAfterCreateNew = () => {
    setChannelName('');
    setChannelType(-1);
    setIsPrivate(0);
  };
  return (
    <>
      {isOpenModal && (
        <>
          <div className="w-screen h-screen overflow-hidden absolute top-0 left-0 z-50 opacity-95 bg-black flex flex-row justify-center items-start pt-9">
            {}
            <div className="z-60 w-[684px] h-[780px] bg-[#151515] rounded-2xl flex-col justify-start items-start gap-3 inline-flex">
              <div className=" self-stretch h-96 flex-col justify-start items-start flex ">
                <div className="self-stretch h-96 px-5 pt-8 pb-5 flex-col justify-start items-start gap-6 flex">
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
                        error={isErrorType}
                      />
                      <ChannelTypeComponent
                        type={1}
                        onChange={onChangeChannelType}
                        error={isErrorType}
                      />
                      <ChannelTypeComponent
                        type={2}
                        onChange={onChangeChannelType}
                        error={isErrorType}
                      />
                      <ChannelTypeComponent
                        type={3}
                        onChange={onChangeChannelType}
                        error={isErrorType}
                      />
                    </div>
                  </div>
                  <ChannelNameTextField
                    onChange={handleChannelNameChange}
                    type={channelType}
                    channelNameProps="WHAT IS CHANNEL'S NAME?"
                    error={isErrorName}
                  />
                  <ChannelStatusModal
                    onChangeValue={onChangeToggle}
                    channelNameProps="IS PRIVATE CHANNEL?"
                  />
                  <CreateChannelButton
                    onClickCancel={handleCloseModal}
                    onClickCreate={handleSubmit}
                  />
                </div>
              </div>
            </div>
          </div>
          {isErrorType !== '' && (
            <AlertTitleTextWarning description={isErrorType} />
          )}
          {isErrorName !== '' && (
            <AlertTitleTextWarning description={isErrorName} />
          )}
        </>
      )}
    </>
  );
};
