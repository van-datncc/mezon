import { useChatSending, useGifsStickersEmoji } from '@mezon/core';
import { selectAllStickerSuggestion, selectCurrentClan, selectModeResponsive, useAppSelector } from "@mezon/store";
import { Icons } from "@mezon/ui";
import { IMessageSendPayload, ModeResponsive, SubPanelName } from '@mezon/utils';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import { useCallback, useRef, useState } from 'react';
import { mockCategoryLogo, mockStickers } from "./StickerMockData";

type ChannelMessageBoxProps = {
  channelId: string;
  mode: number;
};

interface ICategorizedStickerProps {
  stickerList: any[];
  categoryName: string;
  onClickSticker: (stickerUrl: string) => void;
}

interface IStickerPanelProps {
  stickerList: any[];
  onClickSticker: (stickerUrl: string) => void;
}
function stickersquare({ channelId, mode }: ChannelMessageBoxProps) {
  const { sendMessage } = useChatSending({ channelId, mode });

  const handleSend = useCallback(
    (
      content: IMessageSendPayload,
      mentions?: Array<ApiMessageMention>,
      attachments?: Array<ApiMessageAttachment>,
      references?: Array<ApiMessageRef>,
    ) => {
      sendMessage(content, mentions, attachments, references);
    },
    [sendMessage],
  );

  const clanStickers = useAppSelector(selectAllStickerSuggestion);
  const currentClan = useAppSelector(selectCurrentClan);
  const modeResponsive = useAppSelector(selectModeResponsive);
  const categoryLogo = [
    ...(modeResponsive === ModeResponsive.MODE_CLAN ? [{ id: 0, url: currentClan?.logo, type: 'custom' }] : []),
    ...mockCategoryLogo
  ].filter(Boolean);

  const stickers = [
    ...(modeResponsive === ModeResponsive.MODE_CLAN ? clanStickers.map(sticker => ({
      id: sticker.id,
      url: sticker.source,
      type: 'custom'
    })) : []),
    ...mockStickers
  ].filter(Boolean);

  const { setSubPanelActive } = useGifsStickersEmoji();
  const [selectedType, setSelectedType] = useState('');
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickImage = (imageUrl: string) => {
    handleSend({ t: '' }, [], [{ url: imageUrl, height: 40, width: 40, filetype: 'image/gif' }], []);
    setSubPanelActive(SubPanelName.NONE);
  };
  const scrollToCategory = (event: React.MouseEvent, categoryName: string) => {
    event.stopPropagation();
    if (categoryName !== selectedType) {
      setSelectedType(categoryName);
      const categoryDiv = categoryRefs.current[categoryName];
      if (categoryDiv && containerRef.current) {
        const options: ScrollIntoViewOptions = { behavior: 'auto', block: 'start' };
        const containerTop = containerRef.current.getBoundingClientRect().top;
        const categoryTop = categoryDiv.getBoundingClientRect().top;
        const offset = 0;
        const scrollTop = categoryTop - containerTop - offset;
        containerRef.current.scrollTop += scrollTop;
      }
    }
  };



  return (
    <div className="flex h-full w-full md:w-[500px]">
      <div className="w-[10%] md:w-[44px] max-sm:gap-x-1
				flex flex-col max-sm:flex-row max-sm:justify-end gap-y-1
				max-sm:w-full dark:bg-[#1E1F22] bg-bgLightModeSecond pt-1
				px-1 md:items-start h-[25rem] pb-1 rounded
				md:ml-2 mb-2">
        {categoryLogo.map((avt) => (
          <button key={avt.id} onClick={(e) => scrollToCategory(e, avt.type)} className={'flex justify-center items-center w-9 h-9 rounded-full'}>
            <img
              src={avt.url}
              alt={`avt ${avt.id}`}
              className={`w-7 h-7 object-cover aspect-square cursor-pointer dark:hover:bg-bgDisable hover:bg-bgLightModeButton ${avt.type === selectedType ? 'bg-bgDisable' : ''} hover:rounded-full justify-center items-center border border-bgHoverMember rounded-full aspect-square`}
              role="button"
            />
          </button>
        ))}
      </div>
      <div className='flex flex-col h-[400px] overflow-y-auto w-[90%]' ref={containerRef}>
        {categoryLogo.map((avt) => (
          <div ref={(el) => (categoryRefs.current[avt.type] = el)} key={avt.id}>
            <CategorizedStickers stickerList={stickers} onClickSticker={handleClickImage} categoryName={avt.type} />
          </div>
        ))}
      </div>
    </div>
  );
}
export default stickersquare;


const CategorizedStickers: React.FC<ICategorizedStickerProps> = ({ stickerList, categoryName, onClickSticker }) => {
  const stickersListByCategoryName = stickerList.filter(sticker => sticker.type === categoryName);
  const [isShowStickerList, setIsShowStickerList] = useState(true);
  const currentClan = useAppSelector(selectCurrentClan)

  const handleToggleButton = () => {
    setIsShowStickerList(!isShowStickerList);
  }

  return (
    <div>
      <button
        onClick={handleToggleButton}
        className="w-full flex flex-row justify-start items-center pl-1 mb-1 mt-0 py-1 gap-[2px] sticky top-[-0.5rem] dark:bg-[#2B2D31] bg-bgLightModeSecond z-10 dark:text-white text-black max-h-full"
      >
        <p className='uppercase'>{categoryName !== 'custom' ? categoryName : currentClan?.clan_name}</p>
        <span className={`${isShowStickerList ? ' rotate-90' : ''}`}>
          <Icons.ArrowRight />
        </span>
      </button>
      {isShowStickerList && <StickerPanel stickerList={stickersListByCategoryName} onClickSticker={onClickSticker} />}
    </div>
  )
}


const StickerPanel: React.FC<IStickerPanelProps> = ({ stickerList, onClickSticker }) => {
  return (
    <>
      {
        stickerList.length > 0 && (
        <div className="w-auto pb-2 px-2">
          <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-scroll hide-scrollbar">
            {stickerList.map((sticker: any) => (
              <img
                key={sticker.id}
                src={sticker.url}
                alt='sticker'
                className="w-full h-full aspect-square object-cover cursor-pointer dark:hover:bg-bgDisable hover:bg-bgLightModeButton hover:rounded-lg border border-bgHoverMember rounded-lg"
                onClick={() => onClickSticker(sticker.url)}
                role="button"
              />
            ))}
          </div>
        </div>
        )}
    </>
  )
}
