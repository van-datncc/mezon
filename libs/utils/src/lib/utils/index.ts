import { differenceInDays, differenceInSeconds, format, formatDistanceToNowStrict, isSameDay, startOfDay, subDays } from 'date-fns';
import { RefObject } from 'react';
import { ChannelMembersEntity, ILineMention, SenderInfoOptionals, UsersClanEntity } from '../types/index';
import { ApiMessageAttachment } from 'mezon-js/api.gen';

export const convertTimeString = (dateString: string) => {
	const codeTime = new Date(dateString);
	const today = startOfDay(new Date());
	const yesterday = startOfDay(subDays(new Date(), 1));
	if (isSameDay(codeTime, today)) {
		// Date is today
		const formattedTime = format(codeTime, 'HH:mm');
		return `Today at ${formattedTime}`;
	} else if (isSameDay(codeTime, yesterday)) {
		// Date is yesterday
		const formattedTime = format(codeTime, 'HH:mm');
		return `Yesterday at ${formattedTime}`;
	} else {
		// Date is neither today nor yesterday
		const formattedDate = format(codeTime, 'dd/MM/yyyy, HH:mm');
		return formattedDate;
	}
};

export const convertTimeHour = (dateString: string) => {
	const codeTime = new Date(dateString);
	const formattedTime = format(codeTime, 'HH:mm');
	return formattedTime;
};

export const convertDateString = (dateString: string) => {
	const codeTime = new Date(dateString);
	const formattedDate = format(codeTime, 'eee, dd MMMM yyyy');
	return formattedDate;
};

export const getTimeDifferenceInSeconds = (startTimeString: string, endTimeString: string) => {
	const startTime = new Date(startTimeString);
	const endTime = new Date(endTimeString);
	const timeDifferenceInSeconds = differenceInSeconds(endTime, startTime);
	return timeDifferenceInSeconds;
};

export const checkSameDay = (startTimeString: string, endTimeString: string) => {
	if (!startTimeString) return false;
	const startTime = new Date(startTimeString);
	const endTime = new Date(endTimeString);
	const sameDay = isSameDay(startTime, endTime);
	return sameDay;
};

export const focusToElement = (ref: RefObject<HTMLInputElement | HTMLDivElement | HTMLUListElement>) => {
	if (ref && ref.current) {
		ref.current.focus();
	}
};

export const uniqueUsers = (mentions: ILineMention[], userClans: UsersClanEntity[], userChannels: ChannelMembersEntity[]) => {
	const userMentions = Array.from(new Set(mentions.map((user) => user.matchedText)));

	const userMentionsFormat = userMentions.map((user) => user.substring(1));

	const usersNotInChannels = userMentionsFormat.filter(
		(username) => !userChannels.map((user) => user.user).some((user) => user?.username === username),
	);

	const userInClans = userClans.map((clan) => clan.user);

	const userIds = userInClans.filter((user) => usersNotInChannels.includes(user?.username as string)).map((user) => user?.id as string);

	return userIds;
};

export const convertTimeMessage = (timestamp: string) => {
	const textTime = formatDistanceToNowStrict(new Date(parseInt(timestamp) * 1000), { addSuffix: true });
	return textTime;
};

export const isGreaterOneMonth = (timestamp: string) => {
	const date = new Date(parseInt(timestamp) * 1000);
	const now = new Date();
	const result = differenceInDays(now, date);
	return result;
};

export const calculateTotalCount = (senders: SenderInfoOptionals[]) => {
	return senders.reduce((sum: number, item: SenderInfoOptionals) => sum + (item.count ?? 0), 0);
};


export const notImplementForGifOrStickerSendFromPanel = (data:ApiMessageAttachment) => {
	if(data.url?.includes('tenor.com') || data.filetype === 'image/gif'){
		return true
	} else {
		return false
	}
}

export const getVoiceChannelName = (clanName?: string, channelLabel?: string) => {
	return clanName?.replace(' ', '-') + '-' + channelLabel?.replace(' ', '-');
}

export const removeDuplicatesById = (array: any) => {
	return array.reduce((acc: any, current: any) => {
	  const isDuplicate = acc.some((item:any) => item.id === current.id);
  	  if (!isDuplicate) {
		acc.push(current);
	  }
	  	  return acc;
	}, []);
  };