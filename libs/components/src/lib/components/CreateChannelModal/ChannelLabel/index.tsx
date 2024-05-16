interface ChannelLabelModalProps {
	labelProp: string;
}
export const ChannelLableModal: React.FC<ChannelLabelModalProps> = ({ labelProp }) => {
	return <div className="self-stretch dark:text-white text-black text-sm font-bold leading-normal">{labelProp}</div>;
};
