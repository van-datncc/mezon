type GroupPanelsProps = {
	children: React.ReactNode;
};

const GroupPanels = ({ children }: GroupPanelsProps) => {
	return <div className="flex flex-col pb-1 mb-1 border-b-[0.08px] border-b-[#1E1E1E] last:border-b-0 last:mb-0 last:pb-0">{children}</div>;
};

export default GroupPanels;
