import { selectIncomingCallData, selectIsShowIncomingGroupCall } from '@mezon/store-mobile';
import React, { memo } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import CallingGroupModal from '../CallingGroupModal';

const CallingModalGroupWrapper = () => {
	const isShowIncomingGroupCall = useSelector(selectIsShowIncomingGroupCall);
	const incomingCallData = useSelector(selectIncomingCallData);

	if (!isShowIncomingGroupCall) {
		return <View />;
	}

	return <CallingGroupModal dataCall={incomingCallData} />;
};

export default memo(CallingModalGroupWrapper, () => true);
