import { referencesActions, selectGeolocation } from '@mezon/store-mobile';
import { ChannelStreamMode } from 'mezon-js';
import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import ShareLocation from './ShareLocation';

const ShareLocationConfirmModal = ({ mode, channelId }: { mode: ChannelStreamMode; channelId: string }) => {
	const geoLocation = useSelector(selectGeolocation);
	const [visible, setVisible] = useState<boolean>(false);
	const dispatch = useDispatch();

	useEffect(() => {
		if (geoLocation) {
			setVisible(true);
		}
	}, [geoLocation]);

	const handelCancelModal = useCallback(() => {
		setVisible(false);
		dispatch(referencesActions.setGeolocation(null));
	}, []);

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
			<ShareLocation oncancel={handelCancelModal} mode={mode} channelId={channelId} geoLocation={geoLocation} />
		</Modal>
	);
};

export default React.memo(ShareLocationConfirmModal);
