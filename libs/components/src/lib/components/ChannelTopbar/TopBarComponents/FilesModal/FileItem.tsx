import { AttachmentEntity, selectMemberClanByUserId, useAppSelector } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { DOWNLOAD_FILE, EFailAttachment, convertTimeString, electronBridge } from '@mezon/utils';
import isElectron from 'is-electron';
import { ChannelStreamMode } from 'mezon-js';
import { useState } from 'react';
import { RenderAttachmentThumbnail } from '../../../ThumbnailAttachmentRender';

type FileItemProps = {
	readonly attachmentData: AttachmentEntity;
	readonly mode?: ChannelStreamMode;
};

const FileItem = ({ attachmentData, mode }: FileItemProps) => {
	const userSendAttachment = useAppSelector(selectMemberClanByUserId(attachmentData?.uploader ?? ''));
	const userName = userSendAttachment?.user?.username;
	const attachmentSendTime = convertTimeString(attachmentData?.create_time as string);
	const fileType = getFileExtension(attachmentData?.filetype ?? '');

	function getFileExtension(filetype: string) {
		if (filetype === 'application/vnd.android.package-archive') {
			return 'FILE';
		}

		return filetype ?? 'FILE';
	}

	const handleDownload = async (event: React.MouseEvent) => {
		event.stopPropagation();
		const response = await fetch(attachmentData?.url as string);
		if (!response.ok) {
			return;
		}
		if (isElectron()) {
			try {
				await electronBridge.invoke(DOWNLOAD_FILE, {
					url: attachmentData.url as string,
					defaultFileName: attachmentData.filename as string
				});
			} catch (error) {
				console.error('Error during download:', error);
			}
		} else {
			try {
				const blob = await response.blob();
				const dataUrl = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = dataUrl;
				a.download = attachmentData.filename as string;
				a.click();
			} catch (error) {
				console.error('Error during download:', error);
			}
		}
	};
	const thumbnailAttachment = RenderAttachmentThumbnail({ attachment: attachmentData, size: 'w-8 h-10', isFileList: true });

	const hideTheInformationFile =
		attachmentData.filetype !== 'image/gif' &&
		attachmentData.filetype !== 'image/png' &&
		attachmentData.filetype !== 'image/jpeg' &&
		attachmentData.filetype !== 'video/mp4';

	const [hoverShowOptButtonStatus, setHoverShowOptButtonStatus] = useState(false);
	const hoverOptButton = () => {
		setHoverShowOptButtonStatus(true);
	};

	return (
		<div
			onMouseEnter={hoverOptButton}
			onMouseLeave={() => setHoverShowOptButtonStatus(false)}
			onClick={(event) => {
				event.stopPropagation();
				handleDownload(event);
			}}
			className={`cursor-pointer break-all w-full gap-3 flex py-3 pl-3 pr-3 rounded max-w-full ${hideTheInformationFile ? 'dark:border-[#232428] dark:bg-[#2B2D31] bg-white border-2' : ''}  relative`}
			role="button"
		>
			<div className="flex items-center">{thumbnailAttachment}</div>
			{attachmentData.filename === EFailAttachment.FAIL_ATTACHMENT ? (
				<div className="text-red-500">Attachment failed to load.</div>
			) : (
				hideTheInformationFile && (
					<>
						<div className="cursor-pointer">
							<p className="text-blue-500 hover:underline w-fit one-line">{attachmentData?.filename ?? 'File'}</p>
							{hoverShowOptButtonStatus ? (
								<span>
									Download <span className="font-medium uppercase">{fileType}</span>
								</span>
							) : (
								<p className="dark:text-textDarkTheme text-textLightTheme w-fit one-line">
									Shared by {userName} <span className="text-sm text-gray-500">{attachmentSendTime}</span>
								</p>
							)}
						</div>
						{hoverShowOptButtonStatus && (
							<div className="h-8 absolute right-4 top-1/2 transform -translate-y-1/2 rounded-md dark:bg-[#313338] border dark:border-0 bg-gray-200 flex flex-row justify-center items-center">
								<div
									onClick={(event) => {
										event.stopPropagation();
										handleDownload(event);
									}}
									role="button"
									className="rounded-md w-8 h-8 flex flex-row justify-center items-center cursor-pointer dark:hover:bg-[#393C40] hover:bg-gray-300"
								>
									<Icons.Download defaultSize="w-4 h-4" />
								</div>
							</div>
						)}
					</>
				)
			)}
		</div>
	);
};

export default FileItem;
