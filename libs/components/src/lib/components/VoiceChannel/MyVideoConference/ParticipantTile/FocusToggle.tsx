import { isTrackReferencePinned, type TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { LayoutContext, useEnsureTrackRef, useMaybeLayoutContext, useMaybeTrackRefContext } from '@livekit/components-react';
import * as React from 'react';

export interface FocusToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	trackRef?: TrackReferenceOrPlaceholder;
}

export const FocusToggle = React.forwardRef<HTMLButtonElement, FocusToggleProps>(function FocusToggle({ trackRef, ...props }, ref) {
	const trackRefFromContext = useMaybeTrackRefContext();
	const trackReference = useEnsureTrackRef(trackRef ?? trackRefFromContext);
	const layoutContext = useMaybeLayoutContext();

	const inFocus: boolean = React.useMemo(() => {
		return isTrackReferencePinned(trackReference, layoutContext?.pin.state);
	}, [trackReference, layoutContext?.pin.state]);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		props.onClick?.(event);
		if (inFocus) {
			layoutContext?.pin.dispatch?.({ msg: 'clear_pin' });
		} else {
			layoutContext?.pin.dispatch?.({ msg: 'set_pin', trackReference });
		}
	};

	return (
		<LayoutContext.Consumer>
			{(layoutContext) => layoutContext !== undefined && <button ref={ref} {...props} onClick={handleClick}></button>}
		</LayoutContext.Consumer>
	);
});
