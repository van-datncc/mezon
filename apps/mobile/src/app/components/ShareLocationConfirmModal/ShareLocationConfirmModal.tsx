import { useChatSending } from '@mezon/core';
import { Icons } from '@mezon/mobile-components';
import { useTheme } from '@mezon/mobile-ui';
import { selectChannelById, selectDmGroupCurrent, selectGeolocation } from '@mezon/store-mobile';
import { IMessageSendPayload, filterEmptyArrays, processText } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { style } from './styles';

const ShareLocationConfirmModal = ({ mode, channelId }: { mode: ChannelStreamMode; channelId: string }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const geoLocation = useSelector(selectGeolocation);
	const [visible, setVisible] = useState<boolean>(false);
	const currentChannel = useSelector(selectChannelById(channelId));
	const currentDmGroup = useSelector(selectDmGroupCurrent(channelId));
	const [links, setLinks] = useState([]);
	const { t } = useTranslation('message');

	const [googleMapsLink, setGoogleMapsLink] = useState<string>('');
	const { sendMessage } = useChatSending({
		mode,
		channelOrDirect:
			mode === ChannelStreamMode.STREAM_MODE_CHANNEL || mode === ChannelStreamMode.STREAM_MODE_THREAD ? currentChannel : currentDmGroup
	});
	useEffect(() => {
		if (geoLocation) {
			const { latitude, longitude } = geoLocation;
			const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}&z=14&t=m&mapclient=embed`;
			setGoogleMapsLink(googleMapsLink);
			const { links } = processText(googleMapsLink);
			setLinks(links);
			setVisible(true);
		}
	}, [geoLocation]);

	const handleSendMessage = async () => {
		const payloadSendMessage: IMessageSendPayload = {
			t: googleMapsLink,
			hg: [],
			ej: [],
			lk: links || [],
			mk: [],
			vk: []
		};
		setVisible(false);
		await sendMessage(filterEmptyArrays(payloadSendMessage), [], [], [], false, false, true);
	};

	const handelCancelModal = () => {
		setVisible(false);
	};

	return (
		<Modal
			isVisible={visible}
			animationIn={'bounceIn'}
			animationOut={'bounceOut'}
			hasBackdrop={true}
			coverScreen={true}
			avoidKeyboard={false}
			backdropColor={'rgba(0,0,0, 0.7)'}
		>
			<View style={styles.modalContainer}>
				<View style={styles.modalHeader}>
					<Text style={styles.headerText}>
						{t('shareLocationModal.sendThisLocation')}{' '}
						{mode === ChannelStreamMode.STREAM_MODE_CHANNEL || mode === ChannelStreamMode.STREAM_MODE_THREAD
							? currentChannel?.channel_label
							: currentDmGroup?.channel_label}
					</Text>
				</View>
				<View style={styles.modalContent}>
					<View style={styles.circleIcon}>
						<Icons.LocationIcon />
					</View>
					<Text
						style={styles.textContent}
					>{`${t('shareLocationModal.coordinate')} (${geoLocation?.latitude}, ${geoLocation?.longitude})`}</Text>
				</View>
				<View style={styles.modalFooter}>
					<TouchableOpacity style={styles.button} onPress={handelCancelModal}>
						<Text style={styles.textButton}>{t('shareLocationModal.cancel')}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.button} onPress={handleSendMessage}>
						<Text style={styles.textButton}>{t('shareLocationModal.send')}</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

export default React.memo(ShareLocationConfirmModal);
