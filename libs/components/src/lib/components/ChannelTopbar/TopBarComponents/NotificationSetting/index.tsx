import { Dropdown } from 'flowbite-react';
import ItemNotificationSetting from './ItemNotificationSetting';

const NotificationSetting = () => {
	return (
		<div className="absolute top-8 right-0 shadow z-[99999999]">
			<div className="flex flex-col rounded-[4px] w-[202px] shadow-sm overflow-hidden py-[6px] px-[8px] dark:bg-black bg-white">
				<div className="flex flex-col pb-1 mb-1 border-b-[0.08px] dark:border-b-[#6A6A6A] border-b-[#E1E1E1] last:border-b-0 last:mb-0 last:pb-0">
					<Dropdown
						trigger="hover"
						dismissOnClick={false}
						renderTrigger={() => (
							<div>
								<ItemNotificationSetting children="Mute Channel" dropdown="change here" />
							</div>
						)}
						label=""
						placement="right-start"
						className="dark:bg-black bg-white border-none ml-[3px] py-[6px] px-[8px] w-[200px]"
					>
						<ItemNotificationSetting children="For 15 Minutes" />
						<ItemNotificationSetting children="For 1 Hour" />
						<ItemNotificationSetting children="For 3 Hour" />
						<ItemNotificationSetting children="For 8 Hour" />
						<ItemNotificationSetting children="For 24 Hour" />
						<ItemNotificationSetting children="Until I turn it back on" />
					</Dropdown>
				</div>
				<ItemNotificationSetting children="Use Category Default" type="radio" />
				<ItemNotificationSetting children="All Messages" type="radio" />
				<ItemNotificationSetting children="Only @mentions" type="radio" />
				<ItemNotificationSetting children="Nothing" type="radio" />
			</div>
		</div>
	);
};

export default NotificationSetting;
