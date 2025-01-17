import React from "react";
import { FloatButton } from "@mezon/ui";
import { useAppNavigation } from "@mezon/core";
import { useNavigate } from "react-router-dom";
import { notificationActions, useAppDispatch } from "@mezon/store";

type MentionFloatButton = {
	channelId: string;
	clanId: string;
}

export const MentionFloatButton: React.FC<MentionFloatButton> = ({channelId, clanId}) => {
	const { toChannelPage } = useAppNavigation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	
	const handleClickFloatButton = () => {
		if(channelId && clanId) {
			dispatch(notificationActions.setIsShowMentionFloatButton({
				clanId: clanId,
				isShowMentionFloatButton: false
			}));
			dispatch(notificationActions.setChannelHasMentionedByClan({
				channelId: '',
				clanId: ''
			}))
			navigate(toChannelPage(channelId, clanId));
		}
	}
	
	return (
		<>
			<FloatButton content={'New mentions'} backgroundColor={'#DA373C'} textColor={'white'} onClick={handleClickFloatButton} className={'uppercase'}/>
		</>
	)
}