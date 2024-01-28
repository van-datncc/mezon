import { RootState } from '@mezon/store';
import { useSelector } from 'react-redux';
import { Loading } from 'libs/ui/src/lib/Loading/index';

interface CreateChannelProps {
  onClickCancel: () => void;
  onClickCreate: () => void;
}

export const CreateChannelButton: React.FC<CreateChannelProps> = ({
  onClickCancel,
  onClickCreate,
}) => {
  const isLoading = useSelector(
    (state: RootState) => state.channels.loadingStatus,
  );
  return (
    <div className="Frame394 relative border-[#AEAEAE] self-stretch mb-0 bg-[#151515] border-t pt-3 justify-end items-center gap-4 inline-flex">
      <button
        onClick={onClickCancel}
        className="Text text-white hover:underline text-xs font-medium font-['Manrope'] leading-normal"
      >
        Cancel
      </button>

      <button
        disabled={isLoading !== "loaded" ? true : false}
        onClick={onClickCreate}
        className="Text text-white text-xs font-medium font-['Manrope'] leading-normal relative h-10 w-30 justify-center px-3 py-3 bg-blue-600 hover:bg-blue-500 rounded-sm flex flex-row items-center gap-1"
      >
        {isLoading !== 'loaded' && <Loading classProps="w-5 h-5 ml-2" />}
        {isLoading !== 'loaded' ? (
          <span>Creating</span>
        ) : (
          <span>Create Channel</span>
        )}
      </button>
    </div>
  );
};
