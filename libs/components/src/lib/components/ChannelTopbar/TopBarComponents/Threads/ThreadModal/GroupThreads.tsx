type GroupThreadsProps = {
	title: string;
	children: React.ReactNode;
};

const GroupThreads = ({ title, children }: GroupThreadsProps) => {
	return (
		<div>
			<div className="mt-2 mb-2 h-6 text-xs font-semibold leading-6 uppercase">{title}</div>
			{children}
		</div>
	);
};

export default GroupThreads;
