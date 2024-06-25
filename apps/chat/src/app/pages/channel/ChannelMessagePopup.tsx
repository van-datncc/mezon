import { ChannelMessageOpt } from '@mezon/components';
import { selectCurrentChannel } from '@mezon/store';
import { IMessageWithUser } from '@mezon/utils';
import { selectMessageIdRightClicked } from 'libs/store/src/lib/rightClick/rightClick.slice';
import { memo } from 'react';
import { useSelector } from 'react-redux';

type PopupMessageProps = {
	mess: IMessageWithUser;
};

function PopupMessage({ mess }: PopupMessageProps) {
	const currentChannel = useSelector(selectCurrentChannel);
	const getMessageIdRightClicked = useSelector(selectMessageIdRightClicked);

	return (
		<>
			{
				<div
					className={`chooseForText z-[1] absolute h-8 p-0.5 rounded block -top-4 right-5 ${Number(currentChannel?.parrent_id) === 0 ? 'w-32' : 'w-24'}
				`}
				>
					<div className="relative">
						<ChannelMessageOpt message={mess} />
					</div>
				</div>
			}
		</>
	);
}

export default memo(PopupMessage);
