import { useAuth } from '@mezon/core';
import { STORAGE_AGE_RESTRICTED_CHANNEL_IDS, load } from '@mezon/mobile-components';
import { ChannelsEntity, selectCurrentChannel } from '@mezon/store-mobile';
import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import AgeRestricted from './AgeRestricted';
import AgeRestrictedForm from './AgeRestrictedForm';

const AgeRestrictedModal = () => {
	const [isShowAgeRestricted, setIsShowAgeRestricted] = useState(false);
	const currentChannel = useSelector(selectCurrentChannel);
	const { userProfile } = useAuth();

	useEffect(() => {
		const savedChannelIds = load(STORAGE_AGE_RESTRICTED_CHANNEL_IDS);
		if (!savedChannelIds?.includes(currentChannel?.channel_id) && (currentChannel as ChannelsEntity)?.age_restricted === 1) {
			setIsShowAgeRestricted(true);
		} else {
			setIsShowAgeRestricted(false);
		}
	}, [currentChannel]);

	const closeBackdrop = () => {
		setIsShowAgeRestricted(false);
	};
	if (!isShowAgeRestricted) return <View></View>;

	return (
		<Modal
			isVisible={true}
			animationIn={'bounceIn'}
			animationOut={'bounceOut'}
			hasBackdrop={true}
			avoidKeyboard={false}
			backdropColor={'rgba(0,0,0, 0.7)'}
			coverScreen={false}
			deviceHeight={Dimensions.get('screen').height}
		>
			{userProfile?.user?.dob === '0001-01-01T00:00:00Z' ? (
				<AgeRestrictedForm onClose={closeBackdrop} />
			) : (
				<AgeRestricted onClose={closeBackdrop} />
			)}
		</Modal>
	);
};

export default React.memo(AgeRestrictedModal);
