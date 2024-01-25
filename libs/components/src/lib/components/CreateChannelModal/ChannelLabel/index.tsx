interface ChannelLabelModalProps {
    labelProp: string;
}
export const ChannelLableModal: React.FC<ChannelLabelModalProps> = ({
  labelProp,
}) => {
  return (
    <div className="self-stretch text-white text-base font-bold font-['Manrope'] leading-normal">
      {labelProp}
    </div>
  );
};
