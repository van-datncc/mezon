import type { ParticipantClickEvent, TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { isTrackReference, isTrackReferencePinned } from '@livekit/components-core';
import {
	AudioTrack,
	ConnectionQualityIndicator,
	FocusToggle,
	LockLockedIcon,
	ParticipantContext,
	ScreenShareIcon,
	TrackMutedIndicator,
	TrackRefContext,
	VideoTrack,
	useEnsureTrackRef,
	useFeatureContext,
	useIsEncrypted,
	useMaybeLayoutContext,
	useMaybeParticipantContext,
	useMaybeTrackRefContext,
	useParticipantTile
} from '@livekit/components-react';
import { selectMemberClanByUserName, useAppSelector } from '@mezon/store';
import { createImgproxyUrl } from '@mezon/utils';
import type { Participant } from 'livekit-client';
import { Track } from 'livekit-client';
import { PropsWithChildren, forwardRef, useCallback, useMemo } from 'react';
import { AvatarImage } from '../../../AvatarImage/AvatarImage';

export function ParticipantContextIfNeeded(
	props: React.PropsWithChildren<{
		participant?: Participant;
	}>
) {
	const hasContext = !!useMaybeParticipantContext();
	return props.participant && !hasContext ? (
		<ParticipantContext.Provider value={props.participant}>{props.children}</ParticipantContext.Provider>
	) : (
		<>{props.children}</>
	);
}

export function TrackRefContextIfNeeded(
	props: PropsWithChildren<{
		trackRef?: TrackReferenceOrPlaceholder;
	}>
) {
	const hasContext = !!useMaybeTrackRefContext();
	return props.trackRef && !hasContext ? (
		<TrackRefContext.Provider value={props.trackRef}>{props.children}</TrackRefContext.Provider>
	) : (
		<>{props.children}</>
	);
}

export interface ParticipantTileProps extends React.HTMLAttributes<HTMLDivElement> {
	trackRef?: TrackReferenceOrPlaceholder;
	disableSpeakingIndicator?: boolean;

	onParticipantClick?: (event: ParticipantClickEvent) => void;
}

export const ParticipantTile: (props: ParticipantTileProps & React.RefAttributes<HTMLDivElement>) => React.ReactNode = forwardRef<
	HTMLDivElement,
	ParticipantTileProps
>(function ParticipantTile({ trackRef, children, onParticipantClick, disableSpeakingIndicator, ...htmlProps }: ParticipantTileProps, ref) {
	const trackReference = useEnsureTrackRef(trackRef);

	const { elementProps } = useParticipantTile<HTMLDivElement>({
		htmlProps,
		disableSpeakingIndicator,
		onParticipantClick,
		trackRef: trackReference
	});
	const isEncrypted = useIsEncrypted(trackReference.participant);
	const layoutContext = useMaybeLayoutContext();

	const autoManageSubscription = useFeatureContext()?.autoSubscription;

	const handleSubscribe = useCallback(
		(subscribed: boolean) => {
			if (
				trackReference.source &&
				!subscribed &&
				layoutContext &&
				layoutContext.pin.dispatch &&
				isTrackReferencePinned(trackReference, layoutContext.pin.state)
			) {
				layoutContext.pin.dispatch({ msg: 'clear_pin' });
			}
		},
		[trackReference, layoutContext]
	);

	const username = trackReference.participant.identity;
	const member = useAppSelector((state) => selectMemberClanByUserName(state, username));
	const voiceUsername = member?.clan_nick || username;
	const avatar = useMemo(() => {
		return member?.clan_avatar || member?.user?.avatar_url || 'assets/images/mezon-logo-white.svg';
	}, [member]);

	return (
		<div ref={ref} style={{ position: 'relative' }} {...elementProps}>
			<TrackRefContextIfNeeded trackRef={trackReference}>
				<ParticipantContextIfNeeded participant={trackReference.participant}>
					{children ?? (
						<>
							{isTrackReference(trackReference) &&
							(trackReference.publication?.kind === 'video' ||
								trackReference.source === Track.Source.Camera ||
								trackReference.source === Track.Source.ScreenShare) ? (
								<VideoTrack
									trackRef={trackReference}
									onSubscriptionStatusChanged={handleSubscribe}
									manageSubscription={autoManageSubscription}
								/>
							) : (
								isTrackReference(trackReference) && (
									<AudioTrack trackRef={trackReference} onSubscriptionStatusChanged={handleSubscribe} />
								)
							)}
							<div className="lk-participant-placeholder">
								{member && (
									<AvatarImage
										alt={username || ''}
										username={username}
										className="w-20 h-20"
										srcImgProxy={createImgproxyUrl(avatar ?? '', { width: 320, height: 320, resizeType: 'fit' })}
										src={avatar}
									/>
								)}
							</div>
							<div className="lk-participant-metadata">
								<div className="lk-participant-metadata-item">
									{trackReference.source === Track.Source.Camera ? (
										<>
											{isEncrypted && <LockLockedIcon style={{ marginRight: '0.25rem' }} />}
											<TrackMutedIndicator
												trackRef={{
													participant: trackReference.participant,
													source: Track.Source.Microphone
												}}
												show={'muted'}
											></TrackMutedIndicator>
											<span>{voiceUsername}</span>
										</>
									) : (
										<>
											<ScreenShareIcon style={{ marginRight: '0.25rem' }} />
											<span>{voiceUsername} &apos;s screen</span>
										</>
									)}
								</div>
								<ConnectionQualityIndicator className="lk-participant-metadata-item" />
							</div>
						</>
					)}
					<FocusToggle trackRef={trackReference} />
				</ParticipantContextIfNeeded>
			</TrackRefContextIfNeeded>
		</div>
	);
});
