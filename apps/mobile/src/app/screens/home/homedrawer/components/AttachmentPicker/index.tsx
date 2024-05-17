import { PlusIcon } from '@mezon/mobile-components';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export type AttachmentPickerProps = {
	mode?: number;
};

function AttachmentPicker(props: AttachmentPickerProps) {
	const onPicker = () => {
		// TODO: add logic here
		// 	Allow select video, images
	};

	return (
		<TouchableOpacity onPress={onPicker}>
			<PlusIcon width={22} height={22} />
		</TouchableOpacity>
	);
}

export default AttachmentPicker;
