import React from 'react'
import { View, Text} from 'react-native'
import { styles } from './style';
import { selectCurrentChannel } from '@mezon/store';
import { useSelector } from 'react-redux';

import ActionRow from '../ActionRow';
import AssetsViewer from '../AssetViewer';
import { HashSignIcon } from '@mezon/mobile-components';
import { IChannel } from '@mezon/utils';

export default function MenuThreadDetail(props: { route: any }) {
    //NOTE: from DirectMessageDetail component 
    const directMessage = props.route?.params?.directMessage as IChannel;
    const currentChannel = useSelector(selectCurrentChannel);

    return (
        <View style={styles.container}>
            <View style={styles.channelLabelWrapper}>
                {!!(directMessage?.channel_label || currentChannel?.channel_label) && (
                    <>
                        <HashSignIcon width={18} height={18} />
                        <Text numberOfLines={1} style={styles.channelLabel}>{directMessage?.channel_label || currentChannel?.channel_label}</Text>
                    </>
                )}
            </View>

            <ActionRow directMessage={directMessage} />
            <AssetsViewer directMessage={directMessage} />
        </View>

    )
}
