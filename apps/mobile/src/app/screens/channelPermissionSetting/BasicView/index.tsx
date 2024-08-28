import { Icons } from '@mezon/mobile-components';
import { Block, size, Text, useTheme } from '@mezon/mobile-ui';
import { ChannelsEntity } from '@mezon/store-mobile';
import { memo, useCallback, useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { MezonConfirm, MezonSwitch } from '../../../temp-ui';

interface IBasicViewProps {
	channel: ChannelsEntity;
}

export const BasicView = memo(({ channel }: IBasicViewProps) => {
	const { themeValue } = useTheme();
	const [visibleModalConfirm, setVisibleModalConfirm] = useState(false);

	const isPrivateChannel = useMemo(() => {
		return Boolean(channel?.channel_private);
	}, [channel?.channel_private]);

	const onPrivateChannelChange = useCallback((value: boolean) => {
		setVisibleModalConfirm(true);
	}, []);

	const openBottomSheet = () => {
		//
	};

	const updateChannel = async () => {
		//
	};

	const closeModalConfirm = () => {
		//
	};
	return (
		<Block>
			<TouchableOpacity onPress={() => onPrivateChannelChange(!channel?.channel_private)}>
				<Block
					flexDirection="row"
					justifyContent="space-between"
					padding={size.s_14}
					alignItems="center"
					borderRadius={size.s_14}
					backgroundColor={themeValue.primary}
					marginVertical={size.s_16}
				>
					<Block alignItems="center">
						<Text color={themeValue.text}>Private Channel</Text>
					</Block>
					<MezonSwitch value={isPrivateChannel} onValueChange={onPrivateChannelChange} />
				</Block>
			</TouchableOpacity>

			<Text color={themeValue.textDisabled}>By making a channel private, only select members and roles will be able to view this channel</Text>

			<TouchableOpacity onPress={() => openBottomSheet()}>
				<Block
					flexDirection="row"
					justifyContent="space-between"
					padding={size.s_14}
					alignItems="center"
					borderRadius={size.s_14}
					backgroundColor={themeValue.primary}
					marginVertical={size.s_16}
				>
					<Block flexDirection="row" gap={size.s_14} alignItems="center">
						<Icons.CirclePlusPrimaryIcon />
						<Text color={themeValue.text}>Add members or roles</Text>
					</Block>
					<Icons.ChevronSmallRightIcon />
				</Block>
			</TouchableOpacity>

			<Block>
				<Text color={themeValue.textDisabled}>Who can access</Text>
				{/* TODO: list of role */}
				{/* TODO: list of role member, includes clan owner */}
			</Block>

			<MezonConfirm
				visible={visibleModalConfirm}
				onVisibleChange={setVisibleModalConfirm}
				onConfirm={updateChannel}
				onCancel={closeModalConfirm}
				title={isPrivateChannel ? 'Make this channel private?' : 'Make this channel open to everyone?'}
				confirmText={'Yes'}
				content={
					isPrivateChannel
						? `${channel?.channel_label} will become available to all members`
						: `${channel?.channel_label} will become private and visible to select members and roles`
				}
				hasBackdrop={true}
			/>
		</Block>
	);
});
