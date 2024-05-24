import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useChatSending } from '@mezon/core';
import { SearchIcon } from '@mezon/mobile-components';
import { Colors, Fonts } from '@mezon/mobile-ui';
import { selectCurrentChannel } from '@mezon/store-mobile';
import { IMessageSendPayload } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import React, { MutableRefObject, useCallback, useEffect, useState } from 'react';
import { Keyboard, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { useSelector } from 'react-redux';
import GifSelector from './GifSelector';
import StickerSelector from './StickerSelector';
import styles from './styles';

export type IProps = {
	onDone: () => void;
	bottomSheetRef: MutableRefObject<BottomSheetMethods>;
};

interface TextTabProps {
	selected?: boolean;
	title: string;
}
function TextTab({ selected, title }: TextTabProps) {
	return (
		<View style={{ backgroundColor: selected ? Colors.green : 'transparent', ...styles.selected }}>
			<Text style={{ color: selected ? Colors.white : Colors.gray72, fontSize: Fonts.size.small, textAlign: 'center' }}>{title}</Text>
		</View>
	);
}

type ExpressionType = 'emoji' | 'gif' | 'sticker';

function EmojiPicker({ onDone, bottomSheetRef }: IProps) {
	const currentChannel = useSelector(selectCurrentChannel);
	const [mode, setMode] = useState<ExpressionType>('gif');
	const [channelMode, setChannelMode] = useState(0);
	const [searchText, setSearchText] = useState<string>('');

	useEffect(() => {
		setChannelMode(ChannelStreamMode.STREAM_MODE_CHANNEL);
	}, []);

	const { sendMessage } = useChatSending({
		channelId: currentChannel?.id || '',
		channelLabel: currentChannel?.channel_label || '',
		mode: channelMode,
	});

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

	function handleSelected(type: ExpressionType, data: any) {
		if (type === 'gif') {
			handleSend({ t: '' }, [], [{ url: data }], []);
		} else if (type === 'sticker') {
			handleSend({ t: '' }, [], [{ url: data, height: 40, width: 40, filetype: 'image/gif' }], []);
		} else {
			/* empty */
		}

		onDone && onDone();
	}

	function handleInputSearchFocus() {
		bottomSheetRef && bottomSheetRef.current && bottomSheetRef.current.expand();
	}

	function handleInputSearchBlur() {
		Keyboard.dismiss();
	}

	return (
		<TouchableWithoutFeedback onPressIn={handleInputSearchBlur}>
			<View style={styles.container}>
				<View style={styles.tabContainer}>
					<TextTab selected title="Emoji" />
					<TextTab title="GIFs" />
					<TextTab title="Stickers" />
				</View>

				<View style={styles.textInputWrapper}>
					<SearchIcon height={18} width={18} />
					<TextInput style={styles.textInput} onFocus={handleInputSearchFocus} onChangeText={setSearchText} />
				</View>

				<View>
					{mode === 'emoji' ? (
						<Text>Emoji</Text>
					) : mode === 'gif' ? (
						<GifSelector onSelected={(url) => handleSelected('gif', url)} searchText={searchText} />
					) : (
						<StickerSelector onSelected={(url) => handleSelected('sticker', url)} />
					)}
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
}

export default EmojiPicker;
