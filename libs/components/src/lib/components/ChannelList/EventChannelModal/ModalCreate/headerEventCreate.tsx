type HeaderEventCreateProps = {
	tabs: string[];
	currentModal: number;
	onHandleTab: (num: number) => void;
};

const HeaderEventCreate = (props: HeaderEventCreateProps) => {
	const { tabs, currentModal, onHandleTab } = props;

	return tabs.map((item, index) => (
		<div className="flex-grow text-[10px]" key={index} onClick={() => onHandleTab(index)}>
			<div className={`w-full h-[6px] rounded mb-2 cursor-pointer ${currentModal === index ? 'bg-[#959CF7] ' : 'bg-slate-500'}`} />
			<p className={currentModal === index ? 'text-[#959CF7]' : 'text-slate-500'}>{item}</p>
		</div>
	));
};

export default HeaderEventCreate;
