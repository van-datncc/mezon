import { EventManagementEntity, eventManagementActions, selectAllEventManagement, selectChannelById, selectChooseEvent, selectNumberEvent, useAppDispatch } from "@mezon/store";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

export function useEventManagement(){
    const dispatch = useAppDispatch();
    const allEventManagement = useSelector(selectAllEventManagement);
	const numberEventManagement = useSelector(selectNumberEvent);
	const chooseEvent = useSelector(selectChooseEvent);

	const setChooseEvent = useCallback(
		async (event: EventManagementEntity) => {
			await dispatch(eventManagementActions.setChooseEvent(event));
		},
		[dispatch],
	);

    const createEventManagement = useCallback(
		async (clan_id: string, channel_id: string, address: string, title: string, start_time: string, end_time:string, description: string, logo:string) => {
			await dispatch(eventManagementActions.fetchCreateEventManagement({ clan_id, channel_id, address, title, start_time, end_time, description, logo }));
		},
		[dispatch],
	);

	const deleteEventManagement = useCallback(
		async (clan_id: string, event_id: string) => {
			await dispatch(eventManagementActions.fetchDeleteEventManagement({ clanId: clan_id, eventID: event_id}));
		},
		[dispatch],
	);

    return useMemo(
		() => ({
			chooseEvent,
			allEventManagement,
			numberEventManagement,
            createEventManagement,
			deleteEventManagement,
			setChooseEvent,
		}),
		[
			chooseEvent,
            allEventManagement,
			numberEventManagement,
            createEventManagement,
			deleteEventManagement,
			setChooseEvent,
        ],
	);
}