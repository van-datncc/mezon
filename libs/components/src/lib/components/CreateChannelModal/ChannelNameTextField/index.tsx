import { ChannelType } from '@mezon/mezon-js';
import * as Icons from '../../Icons';
import { ChannelLableModal } from '../ChannelLabel';

interface ChannelNameModalProps {
	type: number;
	channelNameProps: string;
	onChange: (value: string) => void;
	error: string;
}

export const ChannelNameTextField: React.FC<ChannelNameModalProps> = ({ channelNameProps, type, onChange, error }) => {
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		onChange(value);
	};

	const iconMap = {
		[ChannelType.CHANNEL_TYPE_TEXT]: <Icons.Hashtag defaultSize="w-6 h-6" />,
		[ChannelType.CHANNEL_TYPE_VOICE]: <Icons.Speaker defaultSize="w-6 h-6" />,
		[ChannelType.CHANNEL_TYPE_FORUM]: <Icons.Forum defaultSize="w-6 h-6" />,
		[ChannelType.CHANNEL_TYPE_ANNOUNCEMENT]: <Icons.Announcement defaultSize="w-6 h-6" />,
		// 2 lines below only get index
		[ChannelType.CHANNEL_TYPE_DM]: <Icons.Hashtag defaultSize="w-6 h-6" />,
		[ChannelType.CHANNEL_TYPE_GROUP]: <Icons.Speaker defaultSize="w-6 h-6" />,
	};

	return (
		<div className="Frame408 self-stretch h-[84px] flex-col justify-start items-start gap-2 flex mt-1">
			<ChannelLableModal labelProp={channelNameProps} />
			<div className="ContentContainer self-stretch h-11 flex-col items-start flex">
				<div
					className={`InputContainer self-stretch h-11 px-4 py-3 bg-neutral-950 rounded shadow border w-full ${error ? 'border border-red-500' : 'border-blue-600'}  justify-start items-center gap-2 inline-flex`}
				>
					{type === -1 ? [] : iconMap[type as ChannelType]}
					<div className="InputValue grow shrink basis-0 self-stretch justify-start items-center flex">
						<input
							className="Input grow shrink basis-0 h-10 outline-none bg-neutral-950 text-neutral-200 text-sm font-normal font-['Manrope'] placeholder-[#AEAEAE]"
							onChange={handleInputChange}
							placeholder="Enter the channel's name"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
