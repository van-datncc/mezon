import { ChannelStreamMode } from 'mezon-js';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useContextMenu } from 'react-contexify';
import MessageContextMenu from '../ContextMenu/MessageContextMenu';

const MESSAGE_CONTEXT_MENU_ID = 'message-context-menu';

type MessageContextMenuContextValue = {
	messageId: string;
	showMessageContextMenu: (
		event: React.MouseEvent<HTMLElement>,
		messageId: string,
		mode: ChannelStreamMode,
		props?: MessageContextMenuProps,
	) => void;
	preloadMessageContextMenu: (messageId: string) => void;
};

type MessageContextMenuProps = {
	messageId: string;
};

export const MessageContextMenuContext = createContext<MessageContextMenuContextValue>({
	messageId: '',
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	showMessageContextMenu: () => {},
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	preloadMessageContextMenu: () => {},
});

export const MessageContextMenuProvider = ({ children }: { children: React.ReactNode }) => {
	const [messageId, setMessageId] = useState('');
	const [elementTarget, setElementTarget] = useState<HTMLElement | null>(null);
	const [activeMode, setActiveMode] = useState<ChannelStreamMode>(ChannelStreamMode.STREAM_MODE_CHANNEL);

	const { show } = useContextMenu({
		id: MESSAGE_CONTEXT_MENU_ID,
	});

	const menu = useMemo(() => {
		if (!messageId) return null;

		return <MessageContextMenu id={MESSAGE_CONTEXT_MENU_ID} messageId={messageId} elementTarget={elementTarget} activeMode={activeMode} />;
	}, [messageId, elementTarget]);

	const preloadMessageContextMenu = useCallback((messageId: string) => {
		setMessageId(messageId);
	}, []);

	const showContextMenu = useCallback(
		(event: React.MouseEvent<HTMLElement>, props: MessageContextMenuProps) => {
			show({
				event,
				props: {
					key: 'value',
				},
			});
		},
		[show],
	);

	const showMessageContextMenu = useCallback(
		(event: React.MouseEvent<HTMLElement>, messageId: string, mode: ChannelStreamMode, props?: MessageContextMenuProps) => {
			setMessageId(messageId);
			setElementTarget(event.target as HTMLElement);
			setActiveMode(mode);
			const niceProps = {
				messageId,

				...props,
			};
			showContextMenu(event, niceProps);
		},
		[showContextMenu],
	);

	const value = useMemo(
		() => ({
			messageId,
			showMessageContextMenu,
			preloadMessageContextMenu,
		}),
		[showMessageContextMenu, preloadMessageContextMenu, messageId],
	);

	return (
		<MessageContextMenuContext.Provider value={value}>
			{children}
			{menu}
		</MessageContextMenuContext.Provider>
	);
};

export const useMessageContextMenu = () => useContext(MessageContextMenuContext);
