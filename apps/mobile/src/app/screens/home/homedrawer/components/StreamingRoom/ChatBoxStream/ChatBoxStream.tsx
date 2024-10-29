import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Block, useTheme } from '@mezon/mobile-ui';
import { selectCurrentStreamInfo } from '@mezon/store-mobile';
import { ChannelStreamMode } from 'mezon-js';
import React, { Ref, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import ChannelMessagesWrapper from '../../../ChannelMessagesWrapper';
import PanelKeyboard from '../../../PanelKeyboard';

const ChatBoxStream = forwardRef(({ props, panelKeyboardRef }: { props: any; panelKeyboardRef: Ref<BottomSheetModalMethods> }) => {
	const { themeValue } = useTheme();
	const currentStreamInfo = useSelector(selectCurrentStreamInfo);

	return (
		<Block height={'100%'} width={'100%'} backgroundColor={'red'}>
			<Block flex={1} backgroundColor={themeValue.primary}>
				<ChannelMessagesWrapper
					channelId={currentStreamInfo?.streamId}
					clanId={currentStreamInfo?.clanId}
					mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
				/>
				<PanelKeyboard ref={panelKeyboardRef} currentChannelId={currentStreamInfo?.streamId} currentClanId={currentStreamInfo?.clanId} />
			</Block>
		</Block>
	);
});

export const ChatBoxStreamComponent = React.memo(ChatBoxStream);
