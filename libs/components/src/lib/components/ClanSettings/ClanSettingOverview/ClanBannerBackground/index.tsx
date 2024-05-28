import { Icons } from '@mezon/components';
import { useClans } from '@mezon/core';
import { selectCurrentChannelId, selectCurrentClanId } from '@mezon/store';
import { handleUploadFile, useMezon } from '@mezon/transport';
import { Button } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

type ClanBannerBackgroundProps = {
	onUpload: (urlImage: string) => void;
	onHasChanges: (hasChanges: boolean) => void;
};

const ClanBannerBackground = ({ onUpload, onHasChanges }: ClanBannerBackgroundProps) => {
	const { sessionRef, clientRef } = useMezon();
	const { currentClan } = useClans();

	const currentClanId = useSelector(selectCurrentClanId) || '';
	const currentChannelId = useSelector(selectCurrentChannelId) || '';

	const [urlImage, setUrlImage] = useState<string | undefined>(currentClan?.banner ?? undefined);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFile = (e: any) => {
		const file = e?.target?.files[0];
		const session = sessionRef.current;
		const client = clientRef.current;

		if (!file) return;

		if (!client || !session) {
			throw new Error('Client or file is not initialized');
		}

		handleUploadFile(client, session, currentClanId, currentChannelId, file?.name, file).then((attachment: any) => {
			setUrlImage(attachment.url ?? '');
			onUpload(attachment.url ?? '');
		});
	};

	const handleOpenFile = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleCloseFile = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setUrlImage('');
	};

	useEffect(() => {
		if (urlImage !== currentClan?.banner) {
			onHasChanges(true);
		} else {
			onHasChanges(false);
		}
	}, [urlImage]);

	return (
		<div className="flex flex-row pt-10 mt-10 border-t border-borderClan">
			<div className="flex flex-col flex-1 text-textSecondary mr-[10px]">
				<h3 className="text-xs font-bold dark:text-textSecondary text-textSecondary800 uppercase mb-2">Server Banner Background</h3>
				<p className="text-sm font-normal mb-2 dark:text-textSecondary text-textSecondary800">
					This image will display at the top of your channels list.
				</p>
				<p className="text-sm font-normal dark:text-textSecondary text-textSecondary800">
					The recommended minimum size is 960x540 and recommended aspect ratio is 16:9.
				</p>
				<Button
					className="h-10 w-fit px-4 mt-4 rounded bg-transparent border border-buttonProfile hover:!bg-buttonProfileHover dark:bg-transparent dark:hover:!bg-buttonProfile focus:!ring-transparent"
					onClick={handleOpenFile}
				>
					Upload Background
				</Button>
			</div>
			<div className="flex flex-1 ml-[10px]">
				<div className="relative w-[320px] h-[180px]">
					<label>
						<div
							style={{ backgroundImage: `url(${urlImage})` }}
							className={`bg-cover bg-no-repeat bg-center w-full h-full bg-buttonProfile rounded relative cursor-pointer`}
						>
							{!urlImage && <p className="text-white text-xl font-semibold text-center pt-[25%]">Choose an Image</p>}
						</div>
						<input ref={fileInputRef} id="upload_banner_background" onChange={(e) => handleFile(e)} type="file" className="hidden" />
					</label>
					<button
						onClick={handleCloseFile}
						className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#A7A8AC] hover:bg-[#919193] flex items-center justify-center"
					>
						{urlImage ? <Icons.Close /> : <Icons.ImageUploadIcon />}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ClanBannerBackground;
