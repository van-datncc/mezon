import React from 'react'
import { View, Text} from 'react-native'
import { styles } from './style';
import { selectCurrentChannel } from '@mezon/store';
import { useSelector } from 'react-redux';
import HashSignIcon from '../../../../assets/svg/channelText-white.svg';

import ActionRow from '../ActionRow';
import AssetsViewer from '../AssetViewer';

export default function MenuThreadDetail() {
    const currentChannel = useSelector(selectCurrentChannel);

    return (
        <View style={styles.container}>
            <View style={styles.channelLabelWrapper}>
                {!!currentChannel?.channel_label && (
                    <>
                        <HashSignIcon width={18} height={18} />
                        <Text style={styles.channelLabel}>{currentChannel?.channel_label}</Text>
                    </>
                )}
            </View>

            <ActionRow />
            <AssetsViewer/>
        </View>

    )
}
