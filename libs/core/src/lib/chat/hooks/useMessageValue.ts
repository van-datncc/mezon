import { channelsActions, selectAllTextInput, selectCurrentChannelId, selectDmGroupCurrentId, selectMode, selectValueTextInputByChannelId, useAppDispatch } from '@mezon/store';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useMessageValue(channelId?: string) {
	const dispatch = useAppDispatch();
	const mode = useSelector(selectMode);
	const currentChannelId = useSelector(selectCurrentChannelId);
	const currentDmGroupId = useSelector(selectDmGroupCurrentId);
	const valueTextInput = useSelector(selectValueTextInputByChannelId(mode === 'clan' ? (channelId || '') : (currentDmGroupId || '')));
	const allTextInput = useSelector(selectAllTextInput);

	const setValueTextInput = useCallback(
		(value: string, isThread?: boolean) => {
			if(mode === 'clan'){
				dispatch(
					channelsActions.setValueTextInput({
						channelId: isThread ? currentChannelId + String(isThread) : (currentChannelId as string),
						value,
					}),
				);
			} else {
				dispatch(
					channelsActions.setValueTextInput({
						channelId: currentDmGroupId || '',
						value,
					}),
				);
			}
			
		},
		[currentChannelId, currentDmGroupId, mode, dispatch],
	);

	const setMode = useCallback(
		(value: string) => {
			dispatch(
				channelsActions.setMode(value)
			);
		},
		[dispatch],
	);

	return useMemo(
		() => ({
			currentChannelId,
			mode,
			currentDmGroupId,
			allTextInput,
			valueTextInput,
			setValueTextInput,
			setMode,
		}),
		[setValueTextInput, setMode, valueTextInput, allTextInput, currentDmGroupId, mode, currentChannelId],
	);
}



// const value = 'dien'


// const listUser = [
//     {
//         "id": "1788103935005822976",
//         "display": "nga.nguyenthi",
//         "avatarUrl": "https://cdn.mezon.vn/1775732550744936448/1775732550778490880/1717055046339image_4.jpg"
//     },
//     {
//         "id": "1775734958942326784",
//         "display": "luk.mink",
//         "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocKdZWvUldu8nd_5qGO5bFf3QhEk8PdlUAIj4vf-axGIwmMK06wT=s96-c"
//     },
//     {
//         "id": "1789901995239280640",
//         "display": "dien.huynhphuc",
//         "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocKCBcSKAhM8GvBrjLq-HlAx-OXMOhlPXAQIgMDevjiUTuncYg=s96-c"
//     },
//     {
//         "id": "1789912002575994880",
//         "display": "ha.nguyen",
//         "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocKt67CSBAa0mOTTMMZKF09JU_ohVj5UwWWTTVJ-H1oK7qRdFA=s96-c"
//     },
//     {
//         "id": "1775731111020111321",
//         "display": "here",
//         "avatarUrl": ""
//     }
// ]

// sort lại vị trí của các phần từ trong list user theo value 
// ví dụ: value = dien thì     {
// 	"id": "1789901995239280640",
// 	"display": "dien.huynhphuc",
// 	"avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocKCBcSKAhM8GvBrjLq-HlAx-OXMOhlPXAQIgMDevjiUTuncYg=s96-c"
// }
// lên trên cùng