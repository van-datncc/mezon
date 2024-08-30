import { useUserPermission } from '@mezon/core';
import { Icons } from '@mezon/mobile-components';
import { size, useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
export default function ThreadAddButton({ onPress }: { onPress: () => void }) {
	const { themeValue } = useTheme();
	const { isCanManageThread } = useUserPermission();
	if (!isCanManageThread) {
		return <View />;
	}
	return (
		<TouchableOpacity onPress={onPress} style={{ padding: size.s_10 }}>
			<Icons.PlusLargeIcon width={22} height={22} color={themeValue.text} />
		</TouchableOpacity>
	);
}
