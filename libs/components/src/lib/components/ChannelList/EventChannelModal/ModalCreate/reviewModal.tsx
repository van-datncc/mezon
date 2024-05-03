import { selectChannelFirst } from '@mezon/store';
import { useSelector } from 'react-redux';
import * as Icons from '../../../Icons';

enum OptionEvent {
	OPTION_SPEAKER = 'Speaker',
	OPTION_HASTAG = 'Hashtag',
}

export type ReviewModalProps = {
	option: string;
	topic: string;
	voice: string | undefined;
	titleEvent: string;
};

const ReviewModal = (props: ReviewModalProps) => {
	const { topic, voice, titleEvent, option } = props;
	const channelFirst = useSelector(selectChannelFirst);

	return (
		<div className="text-white">
			<div className="bg-black rounded-lg overflow-hidden">
				<div className="p-4 border-b border-slate-600">
					<div className="flex items-center gap-x-2 mb-4">
						<Icons.EventIcon />
						<p className="font-semibold text-[#959CF7]">Event</p>
					</div>
					<p className="hover:underline font-bold">{topic}</p>
				</div>
				<div className="p-4 flex items-center gap-x-2">
					{option == OptionEvent.OPTION_SPEAKER && (
						<>
							<Icons.Speaker />
							<p>{voice}</p>
						</>
					)}
					{option == OptionEvent.OPTION_HASTAG && <p>{titleEvent}</p>}
					{option == '' && (
						<>
							<Icons.Hashtag />
							<p className="hover:underline text-slate-400">{channelFirst.channel_label}</p>
						</>
					)}
				</div>
			</div>
			<div className="mt-8">
				<h3 className="text-center font-semibold text-xl">Here's a preview of your event.</h3>
				<p className="text-center text-slate-400">This event will auto-start when it's time.</p>
			</div>
		</div>
	);
};

export default ReviewModal;
