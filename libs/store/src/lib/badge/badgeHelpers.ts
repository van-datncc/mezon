import { TIME_OFFSET } from '@mezon/utils';
import { listChannelsByUserActions } from '../channels/channelUser.slice';
import { channelMetaActions } from '../channels/channelmeta.slice';
import { channelsActions } from '../channels/channels.slice';
import { listChannelRenderAction } from '../channels/listChannelRender.slice';
import { clansActions } from '../clans/clans.slice';
import { directActions } from '../direct/direct.slice';
import { directMetaActions } from '../direct/directmeta.slice';

export interface ResetBadgeParams {
	clanId: string;
	channelId: string;
	badgeCount?: number;
	timestamp?: number;
	messageId?: string;
}

const processedMessagesCache = new Map<string, number>();
const CACHE_DURATION = 5 * 60 * 60 * 1000;

const cleanupOutdatedEntries = () => {
	const now = Date.now();
	for (const [id, timestamp] of processedMessagesCache.entries()) {
		if (now - timestamp > CACHE_DURATION) {
			processedMessagesCache.delete(id);
		}
	}
};

const isMessageAlreadyProcessed = (id: string): boolean => {
	const now = Date.now();
	const lastProcessed = processedMessagesCache.get(id);

	if (lastProcessed && now - lastProcessed < CACHE_DURATION) {
		return true;
	}
	return false;
};

export const resetChannelBadgeCount = (dispatch: any, params: ResetBadgeParams) => {
	const { clanId, channelId, badgeCount, timestamp, messageId } = params;

	cleanupOutdatedEntries();

	const id = channelId + messageId;

	if (messageId) {
		if (isMessageAlreadyProcessed(id)) {
			return;
		}
		if (badgeCount && badgeCount > 0) {
			processedMessagesCache.set(id, Date.now());
		}
	}

	const now = timestamp || Date.now() / 1000;

	if (clanId !== '0') {
		dispatch(listChannelRenderAction.removeBadgeFromChannel({ clanId, channelId }));
		dispatch(
			channelsActions.updateChannelBadgeCount({
				clanId,
				channelId,
				count: 0,
				isReset: true
			})
		);
		dispatch(
			channelMetaActions.setChannelLastSeenTimestamp({
				channelId,
				timestamp: now + TIME_OFFSET
			})
		);
		dispatch(listChannelsByUserActions.resetBadgeCount({ channelId }));
		dispatch(listChannelsByUserActions.updateLastSeenTime({ channelId }));
	} else {
		dispatch(directActions.removeBadgeDirect({ channelId }));
		dispatch(listChannelsByUserActions.resetBadgeCount({ channelId }));
		dispatch(directMetaActions.setDirectLastSeenTimestamp({ channelId, timestamp: now }));
	}

	if (clanId !== '0' && badgeCount !== undefined && badgeCount > 0) {
		dispatch(clansActions.updateClanBadgeCount({ clanId, count: badgeCount * -1 }));
	}
};
