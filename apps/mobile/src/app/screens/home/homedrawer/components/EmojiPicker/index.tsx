import { HashSignIcon, SmilingFaceIcon } from '@mezon/mobile-components';
import React from 'react';
import { useState } from 'react';
import { Keyboard, KeyboardEvent, TouchableOpacity, View } from 'react-native';
import { useEffect } from 'react';

export type EmojiPickerOptions = {
	mode?: number;
	onShow: (isShow: boolean, padding?: number) => void;
};

function EmojiPicker(props: EmojiPickerOptions) {
	const [mode, setMode] = useState<"text" | "emoji">("text");
	const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

	const onPickerPress = () => {
		if (mode === "text") {
			Keyboard.dismiss();
			console.log(",,,", keyboardHeight);
			props.onShow && props.onShow(true, keyboardHeight)
			setMode("emoji");
		} else {
			setMode("text");
			props.onShow && props.onShow(false)
		}
	};

	function keyboardWillShow(event: KeyboardEvent) {
		if (keyboardHeight !== event.endCoordinates.height) {
			setKeyboardHeight(event.endCoordinates.height);
		}
	}

	useEffect(() => {
		Keyboard.addListener('keyboardDidShow', keyboardWillShow);
	}, [])

	return (
		<View>
			<TouchableOpacity onPress={onPickerPress}>
				{mode === "text"
					? <SmilingFaceIcon width={25} height={25} />
					: <HashSignIcon width={25} height={25} />}
			</TouchableOpacity>
		</View>
	);
}

export default EmojiPicker;