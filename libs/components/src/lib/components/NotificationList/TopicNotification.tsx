import { ApiSdTopic } from 'mezon-js/dist/api.gen';
import TopicNotificationItem from './TopicNotificationItem';

type TopicNotificationProps = {
	topic?: ApiSdTopic;
};

export const TopicNotification = ({ topic }: TopicNotificationProps) => {
	return (
		<>
			{topic && (
				<div key={topic.id} className="flex flex-col gap-2 py-3 px-3 w-full">
					<TopicNotificationItem topic={topic} />
				</div>
			)}
		</>
	);
};

export default TopicNotification;
