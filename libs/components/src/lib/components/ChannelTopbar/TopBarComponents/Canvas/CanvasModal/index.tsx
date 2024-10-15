import { useAppNavigation, useEscapeKeyClose, useOnClickOutside, usePermissionChecker, useReference } from '@mezon/core';
import { appActions, selectCurrentChannel, selectTheme, useAppDispatch } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { EOverriddenPermission } from '@mezon/utils';
import { Button } from 'flowbite-react';
import { RefObject, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SearchCanvas from './SearchCanvas';

type CanvasProps = {
    onClose: () => void;
    rootRef?: RefObject<HTMLElement>;
};

const CanvasModal = ({ onClose, rootRef }: CanvasProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { toChannelPage } = useAppNavigation();
    // const { setIsShowCreateThread, threadChannel, threadChannelOld, threadChannelOnline } = useThreads();
    const { setOpenThreadMessageState } = useReference();
    const currentChannel = useSelector(selectCurrentChannel);

    const appearanceTheme = useSelector(selectTheme);
    const [canManageThread] = usePermissionChecker([EOverriddenPermission.manageThread], currentChannel?.id ?? '');

    const handleCreateCanvas = () => {
        dispatch(appActions.setIsShowCanvas(true));
        onClose();
        // setOpenThreadMessageState(false);
        // if (currentChannel && currentChannel?.parrent_id !== '0') {
        //     navigate(toChannelPage(currentChannel.parrent_id as string, currentChannel.clan_id as string));
        // }
        // onClose();
        // setIsShowCreateThread(true, currentChannel?.parrent_id !== '0' ? currentChannel?.parrent_id : currentChannel.channel_id);
        // dispatch(threadsActions.setNameThreadError(''));
        // dispatch(threadsActions.setMessageThreadError(''));
        // dispatch(searchMessagesActions.setIsSearchMessage({ channelId: currentChannel?.channel_id as string, isSearchMessage: false }));
    };

    const modalRef = useRef<HTMLDivElement>(null);
    useEscapeKeyClose(modalRef, onClose);
    useOnClickOutside(modalRef, onClose, rootRef);
    ///
    return (
        <div
            ref={modalRef}
            tabIndex={-1}
            className="absolute top-8 right-0 rounded-md dark:shadow-shadowBorder shadow-shadowInbox z-[99999999] animate-scale_up origin-top-right"
        >
            <div className="flex flex-col rounded-md min-h-[400px] md:w-[480px] max-h-[80vh] lg:w-[540px]  shadow-sm overflow-hidden">
                <div className="dark:bg-bgTertiary bg-bgLightTertiary flex flex-row items-center justify-between p-[16px] h-12">
                    <div className="flex flex-row items-center border-r-[1px] dark:border-r-[#6A6A6A] border-r-[#E1E1E1] pr-[16px] gap-4">
                        <Icons.ThreadIcon />
                        <span className="text-base font-semibold cursor-default dark:text-white text-black">Canvas</span>
                    </div>
                    <SearchCanvas />
                    {canManageThread && (
                        <div className="flex flex-row items-center gap-4">
                            <Button
                                onClick={handleCreateCanvas}
                                size="sm"
                                className="h-6 rounded focus:ring-transparent bg-bgSelectItem dark:bg-bgSelectItem hover:!bg-bgSelectItemHover items-center"
                            >
                                Create
                            </Button>
                            <button onClick={onClose}>
                                <Icons.Close defaultSize="w-4 h-4 dark:text-[#CBD5E0] text-colorTextLightMode" />
                            </button>
                        </div>
                    )}
                </div>
                <div
                    className={`flex flex-col dark:bg-bgSecondary bg-bgLightSecondary px-[16px] min-h-full flex-1 overflow-y-auto ${appearanceTheme === 'light' ? 'customSmallScrollLightMode' : 'thread-scroll'}`}
                >
                    {/* {threadChannelOnline.length > 0 && (
                        <GroupCanvas title={`${threadChannelOnline.length} joined threads`}>
                            {threadChannelOnline.map((thread) => (
                                <CanvasItem thread={thread} key={thread.id} setIsShowThread={onClose} />
                            ))}
                        </GroupCanvas>
                    )}
                    {threadChannelOld.length > 0 && (
                        <GroupCanvas title="order canvas">
                            {threadChannelOld.map((thread) => (
                                <CanvasItem thread={thread} key={thread.id} setIsShowThread={onClose} />
                            ))}
                        </GroupCanvas>
                    )}
                    {threadChannel.length === 0 && <EmptyCanvas onClick={handleCreateCanvas} />} */}
                </div>
            </div>
        </div>
    );
};

export default CanvasModal;
