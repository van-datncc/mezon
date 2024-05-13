import { TextArea } from '@mezon/ui';
import { useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export type EventInfoModalProps = {
	topic: string;
	description: string;
	handleTopic: (content: string) => void;
	handleTime: (time: string) => void;
	handleDescription: (content: string) => void;
};

const EventInfoModal = (props: EventInfoModalProps) => {
	const { topic, description, handleTopic, handleTime, handleDescription } = props;
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [countCharacterDescription, setCountCharacterDescription] = useState(1024);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	const frequencies = [
		'Does not repeat',
		'Weekly on Friday',
		'Every other Friday',
		'Monthly on the first Friday',
		'Annually on 03 May',
		'Every weekday (Monday to Friday)',
	];

	const handleDateChange = (date: Date) => {
		setSelectedDate(date);
	};

	const renderOptions = () => {
		const options = [];
		for (let hour = 0; hour < 24; hour++) {
			for (let minute = 0; minute < 60; minute += 30) {
				const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
				options.push(
					<option key={timeString} value={timeString}>
						{timeString}
					</option>,
				);
			}
		}
		return options;
	};

	const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		handleDescription(e.target.value);
		setCountCharacterDescription(1024 - e.target.value.length);
	};

	const handleChangeTime = (e:any)=>{
		handleTime(e.target.value);
	}

	return (
		<div>
			<div className="mb-4">
				<h3 className="uppercase text-[11px] font-semibold">Event Topic</h3>
				<input
					type="text"
					name="location"
					placeholder="What's your event?"
					onChange={(e) => handleTopic(e.target.value)}
					value={topic}
					className="font-[400] rounded w-full text-white outline-none text-[15px]border border-black p-2 focus:outline-none focus:border-white-500 bg-black"
				/>
			</div>
			<div className="mb-4 flex gap-x-4">
				<div className="w-1/2">
					<h3 className="uppercase text-[11px] font-semibold ">Start Date</h3>
					<DatePicker
						className="bg-black p-2 rounded outline-none w-full"
						wrapperClassName="w-full"
						selected={selectedDate}
						onChange={handleDateChange}
						dateFormat="dd/MM/yyyy"
						minDate={new Date()}
					/>
				</div>
				<div className="w-1/2">
					<h3 className="uppercase text-[11px] font-semibold ">Start Time</h3>
					<select
						name="time"
						onChange={handleChangeTime}
						className="block w-full bg-black border border-black text-white rounded p-2 font-normal text-sm tracking-wide outline-none border-none"
					>
						{renderOptions()}
					</select>
				</div>
			</div>
			<div className="mb-4">
				<h3 className="uppercase text-[11px] font-semibold">Event Frequency</h3>
				<select
					name="frequency"
					className="block w-full bg-black border border-black text-white rounded p-2 font-normal text-sm tracking-wide outline-none border-none"
				>
					{frequencies.map((frequency) => (
						<option key={frequency} value={frequency}>
							{frequency}
						</option>
					))}
				</select>
			</div>
			<div className="mb-4">
				<h3 className="uppercase text-[11px] font-semibold">Description</h3>
				<div className="relative">
					<TextArea
						placeholder="Let everyone know how to use this channel!"
						className="resize-none h-auto min-h-[87px] w-full bg-black overflow-y-hidden outline-none py-2 pl-3 pr-5"
						value={description}
						onChange={handleChangeTextArea}
						rows={1}
						refTextArea={textAreaRef}
					></TextArea>
					<p className="absolute bottom-2 right-2 text-[#AEAEAE]">{countCharacterDescription}</p>
				</div>
			</div>
		</div>
	);
};

export default EventInfoModal;
