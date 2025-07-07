interface ChannelLabelModalProps {
	labelProp: string;
}
export const ChannelLableModal: React.FC<ChannelLabelModalProps> = ({ labelProp }) => {
	return <div className="self-stretch text-sm font-bold leading-normal">{labelProp}</div>;
};
