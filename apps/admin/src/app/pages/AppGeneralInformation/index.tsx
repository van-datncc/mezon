import { getApplicationDetail, selectAppDetail, useAppDispatch } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { ApiApp } from 'mezon-js/api.gen';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const GeneralInformation = () => {
	const appId = useParams().applicationId;
	const appDetail = useSelector(selectAppDetail);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(getApplicationDetail({ appId: appId as string }));
	}, [appId, dispatch]);

	return (
		<div className="flex flex-col gap-10">
			<div className="flex flex-col gap-4">
				<div className="text-[24px] font-semibold">General Information</div>
				<div className="text-[20px]">
					What should we call your creation? What amazing things does it do? What icon should represent it across Mezon? Tell us here!
				</div>
				<div>
					By clicking Create, you agree to the Mezon{' '}
					<span className="cursor-pointer text-blue-700 hover:text-blue-400 hover:underline">Admin Terms of Service</span> and{' '}
					<span className="cursor-pointer text-blue-700 hover:text-blue-400 hover:underline">Admin Policy</span>.
				</div>
			</div>
			<div className="flex gap-5">
				<div className="flex flex-col gap-2 w-fit">
					<div className="text-[12px] uppercase font-semibold">App Icon</div>
					<div className="w-fit flex flex-col items-center p-5 gap-4 bg-[#f2f3f5] dark:bg-[#2b2d31] border dark:border-[#4d4f52] rounded-md">
						<div className="relative w-[144px]">
							<img
								className="aspect-square w-full"
								style={{ borderRadius: '25px' }}
								src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF1IwK6-SxM83UpFVY6WtUZxXx-phss_gAUfdKbkTfau6VWVkt"
								alt="app-icon"
							/>
							<div className="absolute right-[-5px] top-[-5px] p-[8px] bg-[#e3e5e8] rounded-full z-10 shadow-xl border">
								<Icons.SelectFileIcon className="w-6 h-6" />
							</div>
							<div className="uppercase hidden">Choose a neat icon</div>
						</div>
						<div className="text-blue-600 cursor-pointer">Remove</div>
					</div>
				</div>
				{appDetail.token && <AppDetailRight appDetail={appDetail} appId={appId as string} />}
			</div>
		</div>
	);
};

interface IAppDetailRightProps {
	appDetail: ApiApp;
	appId: string;
}

const AppDetailRight = ({ appDetail, appId }: IAppDetailRightProps) => {
	const handleCopyUrl = (url: string) => {
		navigator.clipboard.writeText(url);
	};
	const [appNameField, setAppNameField] = useState(appDetail.appname);
	const handleAppNameFieldOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAppNameField(e.target.value);
	};

	return (
		<div className="flex-1 flex flex-col gap-7">
			<div className="w-full flex flex-col gap-2">
				<div className="text-[12px] uppercase font-semibold">Name</div>
				<input
					value={appNameField}
					onChange={handleAppNameFieldOnchange}
					className="w-full bg-bgLightModeThird rounded-sm border dark:border-[#4d4f52] p-[10px] outline-primary dark:bg-[#1e1f22]"
					type="text"
				/>
			</div>
			<div className="flex flex-col gap-2">
				<div className="text-[12px] uppercase font-semibold">Description (maximum 400 characters)</div>
				<div className="text-[14px]">Your description will appear in the About Me section of your bot's profile.</div>
				<textarea
					className="w-full bg-bgLightModeThird rounded-sm border dark:border-[#4d4f52] min-h-[120px] max-h-[120px] p-[10px] outline-primary dark:bg-[#1e1f22]"
					name=""
					id=""
				></textarea>
			</div>
			<div className="flex flex-col gap-2">
				<div className="text-[12px] uppercase font-semibold">Tags (maximum 5)</div>
				<div className="text-[14px]">Add up to 5 tags to describe the content and functionality of your application.</div>
				<input
					className="w-full bg-bgLightModeThird rounded-sm border dark:border-[#4d4f52] p-[10px] outline-primary dark:bg-[#1e1f22]"
					type="text"
				/>
			</div>
			<div className="text-[12px] font-semibold flex flex-col gap-2">
				<div className="uppercase">Application ID</div>
				<div>{appId}</div>
				<div
					onClick={() => handleCopyUrl(appId)}
					className="py-[7px] px-[16px] bg-blue-600 hover:bg-blue-800 cursor-pointer w-fit text-[15px] text-white rounded-sm"
				>
					Copy
				</div>
			</div>
			<div className="text-[12px] font-semibold flex flex-col gap-2">
				<div className="uppercase">Application Token</div>
				<div>{appDetail.token}</div>
				<div
					onClick={() => handleCopyUrl(appDetail.token as string)}
					className="py-[7px] px-[16px] bg-blue-600 hover:bg-blue-800 cursor-pointer w-fit text-[15px] text-white rounded-sm"
				>
					Copy
				</div>
			</div>
		</div>
	);
};

export default GeneralInformation;
