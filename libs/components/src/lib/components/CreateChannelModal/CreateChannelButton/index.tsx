interface CreateChannelProps {
  onClickCancel: () => void;
  onClickCreate: () => void;
}

export const CreateChannelButton: React.FC<CreateChannelProps> = ({
  onClickCancel,
  onClickCreate,
}) => {
  return (
    <div className="Frame394 relative border-black self-stretch px-5 pt-5 pb-8 bg-[#151515] border-t justify-end items-center gap-4 inline-flex">
      <button
        onClick={onClickCancel}
        className="Text text-white hover:underline text-base font-medium font-['Manrope'] leading-normal"
      >
        Cancel
      </button>

      <button
        onClick={onClickCreate}
        className="Text text-white text-base font-medium font-['Manrope'] leading-normal  px-4 py-3 bg-blue-600 hover:bg-blue-500"
      >
        Create Channel
      </button>
    </div>
  );
};
