import ItemEventManagement from './itemEventManagement';

export type ReviewModalProps = {
	option: string;
	topic: string;
	voice: string | undefined;
	titleEvent: string;
};

const ReviewModal = (props: ReviewModalProps) => {
	const { topic, voice, titleEvent, option } = props;

	return (
		<div className="text-white">
			<ItemEventManagement topic={topic} voiceChannel={voice || ''} titleEvent={titleEvent} option={option}/>
			<div className="mt-8">
				<h3 className="text-center font-semibold text-xl">Here's a preview of your event.</h3>
				<p className="text-center text-slate-400">This event will auto-start when it's time.</p>
			</div>
		</div>
	);
};

export default ReviewModal;
