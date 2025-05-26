import { selectIncomingCallData, selectIsInCall, selectIsShowIncomingGroupCall } from '@mezon/store-mobile';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { AppState, Platform, View } from 'react-native';
import { useSelector } from 'react-redux';
import CallingGroupModal from '../CallingGroupModal';

const CallingModalGroupWrapper = () => {
	const appStateRef = useRef(AppState.currentState);
	const isShowIncomingGroupCall = useSelector(selectIsShowIncomingGroupCall);
	const incomingCallData = useSelector(selectIncomingCallData);
	const isInCall = useSelector(selectIsInCall);

	const handleAppStateChangeListener = useCallback((nextAppState: typeof AppState.currentState) => {
		if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active' && Platform.OS === 'android') {
			// todo: Handle appstate change for incoming group call
		}

		appStateRef.current = nextAppState;
	}, []);

	useEffect(() => {
		const appStateSubscription = Platform.OS === 'android' ? AppState.addEventListener('change', handleAppStateChangeListener) : undefined;
		return () => {
			appStateSubscription && appStateSubscription.remove();
		};
	}, [handleAppStateChangeListener]);

	if (isInCall || !isShowIncomingGroupCall) {
		return <View />;
	}

	return <CallingGroupModal dataCall={incomingCallData} />;
};

export default memo(CallingModalGroupWrapper, () => true);
