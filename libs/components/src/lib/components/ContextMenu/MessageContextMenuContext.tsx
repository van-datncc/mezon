import { useIdleRender } from '@mezon/core';
import {
	pinMessageActions,
	selectClanView,
	selectCurrentChannel,
	selectCurrentClanId,
	selectCurrentTopicId,
	selectDmGroupCurrent,
	selectDmGroupCurrentId,
	selectMessageByMessageId,
	selectModeResponsive,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { ModeResponsive, SHOW_POSITION } from '@mezon/utils';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ShowContextMenuParams, useContextMenu } from 'react-contexify';
import { useModal } from 'react-modal-hook';
import { useSelector } from 'react-redux';
import ModalDeleteMess from '../DeleteMessageModal/ModalDeleteMess';
import { ModalAddPinMess } from '../PinMessModal';
import MessageContextMenu from './MessageContextMenu';

const MESSAGE_CONTEXT_MENU_ID = 'message-context-menu';

type posShortProfileOpt = {
	top?: number | string;
	bottom?: number | string;
	left?: number | string;
	right?: number | string;
};

type MessageContextMenuContextValue = {
	showMessageContextMenu: (
		event: React.MouseEvent<HTMLElement>,
		messageId: string,
		mode: ChannelStreamMode,
		isTopic: boolean,
		props?: Partial<MessageContextMenuProps>
	) => void;
	setPositionShow: (showPostion: SHOW_POSITION) => void;
	posShowMenu: string;
	setImageURL: (url: string) => void;
	imageSrc: string;
	allUserIdsInChannel: string[];
	allRolesInClan: string[];
	posShortProfile: posShortProfileOpt;
	setPosShortProfile: (pos: posShortProfileOpt) => void;
	onVisibilityChange: (status: boolean) => void;
	openDeleteMessageModal: () => void;
	openPinMessageModal: () => void;
};

export type MessageContextMenuProps = {
	messageId: string;
	position?: ShowContextMenuParams['position'];
};

export const MessageContextMenuContext = createContext<MessageContextMenuContextValue>({
	showMessageContextMenu: () => {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
	},
	onVisibilityChange: () => {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
	},

	setPositionShow: () => {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
	},
	posShowMenu: SHOW_POSITION.NONE,
	setImageURL: () => {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
	},
	imageSrc: '',
	allUserIdsInChannel: [],
	allRolesInClan: [],
	posShortProfile: {},
	setPosShortProfile: () => {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
	},
	openDeleteMessageModal: () => {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
	},
	openPinMessageModal: () => {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
	}
});

export const MessageContextMenuProvider = ({
	children,
	allUserIdsInChannel,
	allRolesInClan,
	channelId
}: {
	children: React.ReactNode;
	allUserIdsInChannel: string[];
	allRolesInClan: string[];
	channelId?: string;
}) => {
	const dispatch = useAppDispatch();
	const messageIdRef = useRef<string>('');
	const [elementTarget, setElementTarget] = useState<HTMLElement | null>(null);
	const [activeMode, setActiveMode] = useState<ChannelStreamMode>(ChannelStreamMode.STREAM_MODE_CHANNEL);
	const [posShowMenu, setPosShowMenu] = useState<string>(SHOW_POSITION.NONE);
	const [imageSrc, setImageSrc] = useState<string>(SHOW_POSITION.NONE);
	const [posShortProfile, setPosShortProfile] = useState<posShortProfileOpt>({});
	const [isTopic, setIsTopic] = useState<boolean>(false);

	const currentClanId = useSelector(selectCurrentClanId);
	const currentDmId = useSelector(selectDmGroupCurrentId);
	const isClanView = useSelector(selectClanView);
	const currentTopicId = useSelector(selectCurrentTopicId);
	const currentChannel = useSelector(selectCurrentChannel);
	const modeResponsive = useSelector(selectModeResponsive);
	const currentDm = useSelector(selectDmGroupCurrent(currentDmId || ''));
	const mode = useMemo(() => {
		if (modeResponsive === ModeResponsive.MODE_CLAN) {
			if (currentChannel?.type === ChannelType.CHANNEL_TYPE_TEXT) {
				return ChannelStreamMode.STREAM_MODE_CHANNEL;
			}
			if (currentChannel?.type === ChannelType.CHANNEL_TYPE_THREAD) {
				return ChannelStreamMode.STREAM_MODE_THREAD;
			}
		}

		if (currentDm?.type === ChannelType.CHANNEL_TYPE_DM) {
			return ChannelStreamMode.STREAM_MODE_DM;
		}

		return ChannelStreamMode.STREAM_MODE_GROUP;
	}, [modeResponsive, currentDm?.type, currentChannel?.type]);
	const message = useAppSelector((state) =>
		selectMessageByMessageId(state, isTopic ? currentTopicId : isClanView ? channelId : currentDmId, messageIdRef.current)
	);

	const [openDeleteMessageModal, closeDeleteMessageModal] = useModal(() => {
		return <ModalDeleteMess mess={message} closeModal={closeDeleteMessageModal} mode={mode} />;
	}, [message]);

	const [openPinMessageModal, closePinMessageModal] = useModal(() => {
		return (
			<ModalAddPinMess
				mess={message}
				closeModal={closePinMessageModal}
				handlePinMessage={handlePinMessage}
				mode={activeMode || 0}
				channelLabel={currentChannel?.channel_label || ''}
			/>
		);
	}, [message]);

	const handlePinMessage = async () => {
		dispatch(
			pinMessageActions.setChannelPinMessage({
				clan_id: currentClanId ?? '',
				channel_id: message?.channel_id,
				message_id: message?.id,
				message: message
			})
		);
		dispatch(
			pinMessageActions.joinPinMessage({
				clanId:
					activeMode !== ChannelStreamMode.STREAM_MODE_CHANNEL && activeMode !== ChannelStreamMode.STREAM_MODE_THREAD
						? ''
						: (currentClanId ?? ''),
				channelId:
					activeMode !== ChannelStreamMode.STREAM_MODE_CHANNEL && activeMode !== ChannelStreamMode.STREAM_MODE_THREAD
						? currentDmId || ''
						: (currentChannel?.channel_id ?? ''),
				messageId: message?.id,
				isPublic:
					activeMode !== ChannelStreamMode.STREAM_MODE_CHANNEL && activeMode !== ChannelStreamMode.STREAM_MODE_THREAD
						? false
						: currentChannel
							? !currentChannel.channel_private
							: false,
				mode: activeMode as number
			})
		);
	};

	const { show } = useContextMenu({
		id: MESSAGE_CONTEXT_MENU_ID
	});

	const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

	const menu = useMemo(() => {
		if (!isMenuVisible) return null;
		return (
			<MessageContextMenu
				id={MESSAGE_CONTEXT_MENU_ID}
				messageId={messageIdRef.current}
				elementTarget={elementTarget}
				activeMode={activeMode}
				isTopic={isTopic}
				openDeleteMessageModal={openDeleteMessageModal}
				openPinMessageModal={openPinMessageModal}
			/>
		);
	}, [elementTarget, activeMode, isMenuVisible, isTopic]);

	const setPositionShow = useCallback((pos: string) => {
		setPosShowMenu(pos);
	}, []);

	useEffect(() => {
		// change channel hide menu keep not mount
		channelId && setIsMenuVisible(false);
	}, [channelId]);

	const resetMenuState = useCallback(() => {
		setIsMenuVisible(false);
		setElementTarget(null);
		setActiveMode(ChannelStreamMode.STREAM_MODE_CHANNEL);
		setIsTopic(false);
		messageIdRef.current = '';
	}, []);

	const onVisibilityChange = useCallback((status: boolean) => {
		setIsMenuVisible(status);
	}, []);
	const setImageURL = useCallback((src: string) => {
		setImageSrc(src);
	}, []);

	const showContextMenu = useCallback(
		(event: React.MouseEvent<HTMLElement>, props: MessageContextMenuProps) => {
			const position = props.position || null;
			setIsMenuVisible(true);
			setTimeout(() => {
				show({
					event,
					props,
					position
				});
			}, 100);
		},
		[show]
	);

	const showMessageContextMenu = useCallback(
		(
			event: React.MouseEvent<HTMLElement>,
			messageId: string,
			mode: ChannelStreamMode,
			isTopic: boolean,
			props?: Partial<MessageContextMenuProps>
		) => {
			messageIdRef.current = messageId;
			setElementTarget(event.target as HTMLElement);
			setActiveMode(mode);
			setIsTopic(isTopic);

			const niceProps = {
				messageId,
				...props
			};
			showContextMenu(event, niceProps);
		},
		[setElementTarget, setActiveMode, setIsTopic]
	);

	const value = useMemo(
		() => ({
			showMessageContextMenu,
			setPositionShow,
			posShowMenu,
			setImageURL,
			imageSrc,
			allUserIdsInChannel,
			allRolesInClan,
			posShortProfile,
			setPosShortProfile,
			onVisibilityChange,
			openDeleteMessageModal,
			openPinMessageModal
		}),
		[
			showMessageContextMenu,
			setPositionShow,
			posShowMenu,
			setImageURL,
			imageSrc,
			allUserIdsInChannel,
			allRolesInClan,
			posShortProfile,
			setPosShortProfile,
			onVisibilityChange,
			openDeleteMessageModal,
			openPinMessageModal
		]
	);

	const shouldRender = useIdleRender();

	if (!shouldRender) return null;

	return (
		<MessageContextMenuContext.Provider value={value}>
			{children}
			{menu}
		</MessageContextMenuContext.Provider>
	);
};

export const useMessageContextMenu = () => useContext(MessageContextMenuContext);
