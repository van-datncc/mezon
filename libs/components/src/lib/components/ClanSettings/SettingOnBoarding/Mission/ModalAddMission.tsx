import { EGuideType, ETypeMission, onboardingActions, selectChannelsByClanId, selectCurrentClanId, useAppDispatch } from '@mezon/store';
import { ChannelStatusEnum } from '@mezon/utils';
import { ChangeEvent, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import GuideItemLayout from '../GuideItemLayout';
import ModalControlRule, { ControlInput } from '../ModalControlRule';
type TypeMission = {
	id: number;
	description: string;
	name: string;
};
const ModalAddMission = ({ onClose }: { onClose: () => void }) => {
	const listTypeMisstion: TypeMission[] = [
		{
			id: ETypeMission.SEND_MESSAGE,
			description: 'Member sends a message in the channel',
			name: 'mission1'
		},
		{
			id: ETypeMission.VISIT,
			description: 'Member visits the channel',
			name: 'mission2'
		},
		{
			id: ETypeMission.DOSOMETHING,
			description: 'Member visits the thread',
			name: 'mission3'
		}
	];
	const currentClanId = useSelector(selectCurrentClanId);
	const allChannel = useSelector(selectChannelsByClanId(currentClanId as string));
	const listMissionChannel = useMemo(() => {
		return allChannel.filter((channel) => channel.channel_private !== ChannelStatusEnum.isPrivate).slice(0, 7);
	}, [allChannel]);

	const [title, setTitle] = useState('');
	const [missionChannel, setMissionChannel] = useState(listMissionChannel[0].id);
	const [mission, setMission] = useState<number | null>(null);
	const dispatch = useAppDispatch();
	const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};

	const handleSetMission = (value: number) => {
		setMission(value);
	};

	const handleSetChannelMission = (e: ChangeEvent<HTMLSelectElement>) => {
		setMissionChannel(e.target.value);
	};

	const handleAddTask = () => {
		dispatch(
			onboardingActions.addMission({
				title: title,
				guide_type: EGuideType.TASK,
				task_type: mission || 0,
				channel_id: missionChannel
			})
		);
		onClose();
	};
	return (
		<ModalControlRule onClose={onClose} onSave={handleAddTask}>
			<div className="flex flex-col ">
				<ControlInput
					message="Actions must be at least 7 characters"
					placeholder="Ex. Post a photo of your pet"
					title="What should the new member do?"
					onChange={handleChangeTitle}
					value={title}
					required
				/>
				<div className="w-full h-[1px] my-6 bg-channelTextLabel"></div>

				<div className="flex flex-col gap-2">
					<h1 className="text-base font-semibold text-white">
						Where should they do it? <span className="text-red-500">*</span>
					</h1>
					<div className="flex flex-col">
						<select
							className="w-full p-[10px] outline-none rounded bg-borderDefault"
							onChange={handleSetChannelMission}
							value={listMissionChannel[0].id}
						>
							{listMissionChannel.map((channel) => (
								<option value={channel.id} key={channel.id}>
									{channel.channel_label}
								</option>
							))}
						</select>

						<span className="text-xs mt-1">Channels must be viewable by @everyone (public channel)</span>
					</div>
				</div>

				<div className="w-full h-[1px] my-6 bg-channelTextLabel"></div>

				<GuideItemLayout
					className="!p-0"
					background="bg-transparent hover:bg-transparent"
					title="Upload a custom thumbnail"
					description="72x72 minimum. 1:1 aspect ratio. PNG, JPG"
				/>

				<div className="w-full h-[1px] my-6 bg-channelTextLabel"></div>

				<div className="flex flex-col">
					<h1 className="text-base font-semibold text-white">
						This task is complete when: <span className="text-red-500">*</span>
					</h1>

					{listTypeMisstion.map((missions) => (
						<div className="w-full flex mt-2 gap-2 items-center" key={missions.name}>
							<input
								id={missions.name}
								onClick={(e) => handleSetMission(missions.id)}
								type="radio"
								className={`appearance-none text-white w-5 h-5 bg-transparent relative rounded-full accent-white border-2  border-channelTextLabel checked:after:absolute checked:after:w-3 checked:after:h-3 checked:after:top-[2.4px] checked:after:left-[2.4px] checked:after:bg-white checked:after:content-[""] checked:after:rounded-full ${mission === missions.id ? 'border-white' : ''} `}
								name="mission"
							/>
							<label htmlFor={missions.name} className={`text-base font-medium ${mission === missions.id ? 'text-white' : ''}`}>
								{missions.description}
							</label>
						</div>
					))}
				</div>
			</div>
		</ModalControlRule>
	);
};

export default ModalAddMission;
