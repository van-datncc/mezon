import { useCategory,  useEscapeKey } from '@mezon/core';
import { channelsActions, selectCurrentClan, selectTheme, useAppDispatch } from '@mezon/store';
import { ICategoryChannel } from '@mezon/utils';
import { ChannelType } from 'mezon-js';
import { useSelector } from 'react-redux';
import { CreateNewChannelModal } from '../CreateChannelModal';
import { Events } from './ChannelListComponents';
import CategorizedChannels from "./CategorizedChannels";
export type ChannelListProps = { className?: string };
export type CategoriesState = Record<string, boolean>;

function ChannelList({ channelCurrentType }: { readonly channelCurrentType?: number }) {
	const dispatch = useAppDispatch();
	const { categorizedChannels } = useCategory();
	const appearanceTheme = useSelector(selectTheme);
	const currentClan = useSelector(selectCurrentClan);

	useEscapeKey(() => dispatch(channelsActions.openCreateNewModalChannel(false)));
  
  return (
    <>
      <div
        onContextMenu={(event) => event.preventDefault()}
        className={`overflow-y-scroll overflow-x-hidden w-[100%] h-[100%] pb-[10px] ${appearanceTheme === 'light' ? 'customSmallScrollLightMode' : 'thread-scroll'}`}
        id="channelList"
        role="button"
      >
        {<CreateNewChannelModal />}
        {currentClan?.banner && (
          <div className="h-[136px]">
            {currentClan?.banner && <img src={currentClan?.banner} alt="imageCover" className="h-full w-full object-cover" />}
          </div>
        )}
        <div className="self-stretch h-fit flex-col justify-start items-start gap-1 p-2 flex">
          <Events />
        </div>
        <hr className="h-[0.08px] w-full dark:border-borderDivider border-white mx-2" />
        <div
          className={`overflow-y-scroll flex-1 pt-3 space-y-[21px]  text-gray-300 scrollbar-hide ${channelCurrentType === ChannelType.CHANNEL_TYPE_VOICE ? 'pb-[230px]' : 'pb-[120px]'}`}
        >
          {categorizedChannels.map((category: ICategoryChannel) => (
            <CategorizedChannels category={category}/>
          ))}
        </div>
      </div>
    </>
		
	);
}

export default ChannelList;
