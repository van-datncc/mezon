import { selectMemberClanByUserId, selectTalkingUser, useAppSelector } from '@mezon/store';
import { useSelector } from 'react-redux';
import { IconLoadingTyping } from '../Icons';

type Props = {
	readonly id: string;
	url?: string;
	name?: string;
};

export function NameComponent({ id, name }: Props) {
	const user = useSelector(selectMemberClanByUserId(id));
	const isTalking = useAppSelector((state) => selectTalkingUser(state, id));
	return isTalking.length === 0 ? (
		<p className="text-sm font-medium dark:text-[#AEAEAE] text-colorTextLightMode">{name ? name : user?.user?.username}</p>
	) : (
		<p className="text-sm font-medium dark:text-[#AEAEAE] text-colorTextLightMode">
			{name ? name : user?.user?.username} <IconLoadingTyping />
		</p>
	);
}
