import { Icons } from '@mezon/mobile-components';
import { Colors, size } from '@mezon/mobile-ui';
import { ChannelStatusEnum } from '@mezon/utils';
import { ChannelType } from 'mezon-js';
import React, { useMemo } from 'react';

function IconChannel({ channelPrivate, type }: { channelPrivate: number; type }) {
	const isChannelPrivate = useMemo(() => channelPrivate === ChannelStatusEnum.isPrivate, [channelPrivate]);

	const renderIcon = () => {
		switch (type) {
			case ChannelType.CHANNEL_TYPE_CHANNEL:
				return isChannelPrivate ? (
					<Icons.TextLockIcon width={size.s_20} height={size.s_20} color={Colors.textGray} />
				) : (
					<Icons.TextIcon width={size.s_20} height={size.s_20} color={Colors.textGray} />
				);
			case ChannelType.CHANNEL_TYPE_THREAD:
				return isChannelPrivate ? (
					<Icons.ThreadLockIcon width={size.s_20} height={size.s_20} color={Colors.textGray} />
				) : (
					<Icons.ThreadIcon width={size.s_20} height={size.s_20} color={Colors.textGray} />
				);

			case ChannelType.CHANNEL_TYPE_GMEET_VOICE:
				return isChannelPrivate ? (
					<Icons.VoiceLockIcon width={size.s_20} height={size.s_20} color={Colors.textGray} />
				) : (
					<Icons.VoiceNormalIcon width={size.s_20} height={size.s_20} color={Colors.textGray} />
				);

			case ChannelType.CHANNEL_TYPE_STREAMING:
				return <Icons.StreamIcon width={size.s_20} height={size.s_20} color={Colors.textGray} />;
			case ChannelType.CHANNEL_TYPE_APP:
				return <Icons.AppChannelIcon width={size.s_20} height={size.s_20} color={Colors.textGray} />;
			case ChannelType.CHANNEL_TYPE_ANNOUNCEMENT:
				return <Icons.Announcement defaultSize={size.s_20} defaultFill={Colors.textGray} />;
			case ChannelType.CHANNEL_TYPE_FORUM:
				return <Icons.Forum defaultSize={size.s_20} defaultFill={Colors.textGray} />;

			default:
				return null;
		}
	};

	return renderIcon();
}
export default React.memo(IconChannel);
