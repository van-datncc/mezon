import { TextArea, TimePicker } from '@mezon/ui';
import { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { handleUploadFile, useMezon } from '@mezon/transport';
import { selectCurrentChannelId, selectCurrentClanId } from '@mezon/store';
import { useSelector } from 'react-redux';
import { ModalErrorTypeUpload, ModalOverData } from '../../../ModalError';
import { OptionEvent } from '@mezon/utils';
import { useApp } from '@mezon/core';

export type EventInfoModalProps = {
	topic: string;
	description: string;
	option: string;
	logo: string;
	selectedDateStart: Date;
	selectedDateEnd: Date;
	timeStart: string;
	timeEnd: string;
	timeStartDefault: string;
	timeEndDefault: string;
	setSelectedDateStart: (value: Date) => void;
	setSelectedDateEnd: (value: Date) => void;
	setLogo: (value: string) => void;
	handleTopic: (content: string) => void;
	handleTimeStart: (time: string) => void;
	handleTimeEnd: (time: string) => void;
	handleDescription: (content: string) => void;
	setErrorTime: (status: boolean) => void;
};

const EventInfoModal = (props: EventInfoModalProps) => {
	const { topic, description, option, logo, selectedDateStart, selectedDateEnd, timeStart, timeEnd, timeStartDefault, timeEndDefault, setSelectedDateStart, setSelectedDateEnd, setLogo, handleTopic, handleTimeStart, handleTimeEnd, handleDescription, setErrorTime } = props;
	const [countCharacterDescription, setCountCharacterDescription] = useState(1024);
	const [errorStart, setErrorStart] = useState(false);
	const [errorEnd, setErrorEnd] = useState(false);
	const [checkDaySame, setCheckDaySame] = useState(true);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	const currentClanId = useSelector(selectCurrentClanId) || '';
	const currentChannelId = useSelector(selectCurrentChannelId) || '';

	const frequencies = [
		'Does not repeat',
		'Weekly on Friday',
		'Every other Friday',
		'Monthly on the first Friday',
		'Annually on 03 May',
		'Every weekday (Monday to Friday)',
	];

	const handleDateChangeStart = (date: Date) => {
		setSelectedDateStart(date);
	};

	const handleDateChangeEnd = (date: Date) => {
		setSelectedDateEnd(date);
		compareDate(selectedDateStart, date);
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

	const handleChangeTimeStart = (e:any)=>{
		const time = e.target.value;
		handleTimeStart(time);
		if(compareTime(timeStartDefault, time, true)){
			setErrorStart(false);
		} else {
			setErrorStart(true);
		}

	}

	const handleChangeTimeEnd = (e:any)=>{
		handleTimeEnd(e.target.value);
		if((checkDaySame && compareTime(timeStart, e.target.value)) || (!checkDaySame)) {
			setErrorEnd(false);
		} else {
			setErrorEnd(true);
		}
	}

	const compareDate = (start: Date, end: Date) => {
		const startDay = new Date(start);
		const endDay = new Date(end);

		const dayStart = startDay.getDate();
		const monthStart = startDay.getMonth();
		const yearStart = startDay.getFullYear();

		const dayEnd = endDay.getDate();
		const monthEnd = endDay.getMonth();
		const yearEnd = endDay.getFullYear();

		if ((yearStart === yearEnd) && (monthStart === monthEnd) && (dayStart === dayEnd)){
			setCheckDaySame(true);
		} else {
			setCheckDaySame(false);
		}
	}

	const compareTime = (start: string, end: string, equal?: boolean) =>{
		const [hourStart, minuteStart] = start.split(":").map(Number);
		const [hourEnd, minuteEnd] = end.split(":").map(Number);

		const totalStart = hourStart * 60 + minuteStart;
		const totalEnd = hourEnd * 60 + minuteEnd;

		if(equal && (totalStart <= totalEnd)) {
			return true;
		}

		if(totalStart < totalEnd) {
			return true;
		}
		return false;
	}

	const {appearanceTheme} = useApp();
	const [openModal, setOpenModal] = useState(false);
	const [openModalType, setOpenModalType] = useState(false);
	const { sessionRef, clientRef } = useMezon();
	const handleFile = (e: any) => {
		const file = e?.target?.files[0];
		const sizeImage = file?.size;
		const session = sessionRef.current;
		const client = clientRef.current;
		if (!file) return;
		if (!client || !session) {
			throw new Error('Client or file is not initialized');
		}
		const allowedTypes = ['image/jpeg', 'image/png'];
		if (!allowedTypes.includes(file.type)) {
			setOpenModalType(true);
			e.target.value = null;
			return;
		}

		if (sizeImage > 1000000) {
			setOpenModal(true);
			e.target.value = null;
			return;
		}
		handleUploadFile(client, session, currentClanId, currentChannelId, file?.name, file).then((attachment: any) => {
			setLogo(attachment.url ?? '');
		});
	};

	useEffect(() => {
		if(!checkDaySame){
			setErrorEnd(false);
		}
		if(checkDaySame  && !compareTime(timeStart, timeEnd) && option === OptionEvent.OPTION_LOCATION ){
			setErrorEnd(true);
		}
	}, [checkDaySame, timeStart, timeEnd]);

	useEffect(() => {
		if(errorEnd || errorStart){
			setErrorTime(true);
		} else {
			setErrorTime(false);
		}
	}, [errorEnd, errorStart]);

	return (
		<div className='max-h-[500px] overflow-y-auto hide-scrollbar' onClick={renderOptions}>
			<div className="mb-4">
				<h3 className="uppercase text-[11px] font-semibold inline-flex gap-x-2">
					Event Topic
					<p className="w-fit h-fit text-left text-xs font-medium leading-[150%] text-[#dc2626]">✱</p>
				</h3>
				<input
					type="text"
					name="location"
					placeholder="What's your event?"
					onChange={(e) => handleTopic(e.target.value)}
					value={topic}
					className={`font-[400] rounded w-full dark:text-white text-black outline-none text-[15px]border dark:border-black p-2 focus:outline-none focus:border-white-500 dark:bg-black bg-bgModifierHoverLight ${appearanceTheme === "light" ? "lightEventInputAutoFill" : ""}`}
				/>
			</div>
			<div className="mb-4 flex gap-x-4">
				<div className="w-1/2">
					<h3 className="uppercase text-[11px] font-semibold inline-flex gap-x-2">
						Start Date
						<p className="w-fit h-fit text-left text-xs font-medium leading-[150%] text-[#dc2626]">✱</p>
					</h3>
					<DatePicker
						className="dark:bg-black bg-bgModifierHoverLight dark:text-white text-black p-2 rounded outline-none w-full"
						wrapperClassName="w-full"
						selected={selectedDateStart}
						onChange={handleDateChangeStart}
						dateFormat="dd/MM/yyyy"
						minDate={new Date()}
					/>
				</div>
				<div className="w-1/2">
					<h3 className="uppercase text-[11px] font-semibold inline-flex gap-x-2">
						Start Time
						<p className="w-fit h-fit text-left text-xs font-medium leading-[150%] text-[#dc2626]">✱</p>
					</h3>
					<TimePicker value={timeStart} name='timeStart' handleChangeTime={handleChangeTimeStart}/>
				</div>
			</div>
			{option === OptionEvent.OPTION_LOCATION && 
				<div className="mb-4 flex gap-x-4">
					<div className="w-1/2">
						<h3 className="uppercase text-[11px] font-semibold inline-flex gap-x-2">
							End Date
							<p className="w-fit h-fit text-left text-xs font-medium leading-[150%] text-[#dc2626]">✱</p>
						</h3>
						<DatePicker
							className="dark:bg-black bg-bgModifierHoverLight dark:text-white text-black p-2 rounded outline-none w-full"
							wrapperClassName="w-full"
							selected={selectedDateEnd}
							onChange={handleDateChangeEnd}
							dateFormat="dd/MM/yyyy"
							minDate={new Date()}
						/>
					</div>
					<div className="w-1/2">
						<h3 className="uppercase text-[11px] font-semibold inline-flex gap-x-2">
							End Time
							<p className="w-fit h-fit text-left text-xs font-medium leading-[150%] text-[#dc2626]">✱</p>
						</h3>
						<TimePicker value={timeEnd} name='timeEnd' handleChangeTime={handleChangeTimeEnd}/>
					</div>
				</div>
			}
			<div className="mb-4">
				<h3 className="uppercase text-[11px] font-semibold">Event Frequency</h3>
				<select
					name="frequency"
					className="block w-full dark:bg-black bg-bgModifierHoverLight dark:text-white text-black border dark:border-black rounded p-2 font-normal text-sm tracking-wide outline-none border-none"
				>
					{frequencies.map((frequency) => (
						<option key={frequency} value={frequency}>
							{frequency}
						</option>
					))}
				</select>
				{errorStart && <p className='text-[#e44141] text-xs font-thin'>The start time must be in the future.</p>}
				{errorEnd && <p className='text-[#e44141] text-xs font-thin'>The end time must be bigger than start time.</p>}
			</div>
			<div className="mb-4">
				<h3 className="uppercase text-[11px] font-semibold">Description</h3>
				<div className="relative">
					<TextArea
						placeholder="Let everyone know how to use this channel!"
						className="resize-none h-auto min-h-[87px] w-full dark:bg-black bg-bgModifierHoverLight dark:text-white text-black overflow-y-hidden outline-none py-2 pl-3 pr-5"
						value={description}
						onChange={handleChangeTextArea}
						rows={1}
						refTextArea={textAreaRef}
					></TextArea>
					<p className="absolute bottom-2 right-2 text-[#AEAEAE]">{countCharacterDescription}</p>
				</div>
			</div>
			<div className="mb-4">
				<h3 className="uppercase text-[11px] font-semibold">Cover Image</h3>
				<label>
					<div
						className="text-white font-medium bg-bgSelectItem hover:bg-bgSelectItemHover rounded px-4 py-2 my-2 w-fit"
						onChange={(e) => handleFile(e)}
					>
						Upload Image
					</div>
					<input type="file" onChange={(e) => handleFile(e)} className="w-full text-sm text-slate-500 hidden" />
				</label>
				{logo && <img src={logo} alt="logo" className='max-h-[180px] rounded w-full object-cover'/> }
			</div>
			<ModalOverData openModal={openModal} handleClose={() => setOpenModal(false)}/>
			
			<ModalErrorTypeUpload openModal={openModalType} handleClose={() => setOpenModalType(false)}/>
		</div>
	);
};

export default EventInfoModal;
