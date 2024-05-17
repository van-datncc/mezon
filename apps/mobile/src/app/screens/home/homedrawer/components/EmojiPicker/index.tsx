import { HashSignIcon, SmilingFaceIcon } from '@mezon/mobile-components';
import React from 'react';
import { useState } from 'react';
import { Keyboard, KeyboardEvent, TouchableOpacity, View } from 'react-native';
import { useEffect } from 'react';

export type IMode = "text" | "emoji"

export type IProps = {
	mode: IMode;
	onChange: (mode: IMode, height?: number) => void;
};

function EmojiSwitcher({ mode: _mode, onChange }: IProps) {
	// TODO: Assume height is 274
	const [keyboardHeight, setKeyboardHeight] = useState<number>(274);
	const [mode, setMode] = useState<IMode>(_mode);

	const onPickerPress = () => {
		if (mode === "text") {
			Keyboard.dismiss();
			onChange && onChange("emoji", keyboardHeight)
			setMode("emoji");
		} else {
			setMode("text");
			onChange && onChange("text", keyboardHeight);
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

	useEffect(() => {
		setMode(_mode)
		console.log(_mode);
	}, [_mode])

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

export default EmojiSwitcher;