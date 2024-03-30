import { handleUploadFile } from "@mezon/transport";
import { Icons } from "react-toastify";
import { ApiMessageAttachment } from "vendors/mezon-js/packages/mezon-js/api.gen";

export type FileSelectionButtonProps = {
	onFinishUpload: (attachment: ApiMessageAttachment) => void
}

function FileSelectionButton({ onFinishUpload} : FileSelectionButtonProps) {

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0];
		const fullfilename = ('' + currentClanId + '/' + currentChannelId).replace(/-/g, '_') + '/' + file?.name;
		const session = sessionRef.current;
		const client = clientRef.current;
		if (!file) return;
		if (!client || !session || !currentChannelId) {
			throw new Error('Client or file is not initialized');
		}

		handleUploadFile(client, session, fullfilename, file).then((attachment) => {
			onFinishUpload(attachment);
		});
	};

    return (
        <label>
            <input
                id="preview_img"
                type="file"
                onChange={(e) => {
                    handleFile(e), (e.target.value = '');
                }}
                className="block w-full hidden"
            />
            <div className="flex flex-row h-6 w-6 items-center justify-center ml-2 mb-2 cursor-pointer">
                <Icons.AddCircle />
            </div>
        </label>
    );
}

export default FileSelectionButton;