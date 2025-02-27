import { addRedirectUri, IApplicationEntity, selectDraftRedirectUriByAppId, useAppDispatch } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';

interface IRedirectsProps {
	currentApp: IApplicationEntity;
}

const Redirects = ({ currentApp }: IRedirectsProps) => {
	const dispatch = useAppDispatch();
	const draftDirectURIes = useSelector((state) => selectDraftRedirectUriByAppId(state, currentApp.id));
	const appURIes = currentApp?.oAuthClient?.redirect_uris ?? [];
	const handleAddDirectUri = () => {
		dispatch(addRedirectUri({ appId: currentApp.id, uri: '' }));
	};

	return (
		<div className="flex flex-col gap-2 rounded-md dark:bg-bgSecondary bg-bgLightSecondary p-5 dark:text-textPrimary text-colorTextLightMode">
			<div className="text-black dark:text-white font-medium text-xl">Redirects</div>
			<div className="flex flex-col gap-5">
				<div>
					You must specify at least one URI for authentication to work. If you pass a URI in an OAuth request, it must exactly match one of
					the URIs you enter here.
				</div>
				<div className="flex flex-col gap-5">
					{appURIes.map((uri, index) => (
						<UriItem uri={uri} key={index} />
					))}
					{draftDirectURIes.map((uri, index) => (
						<UriItem uri={uri} key={index} />
					))}
					<div
						onClick={handleAddDirectUri}
						className="py-[7px] px-4 cursor-pointer bg-blue-600 hover:bg-blue-800 transition-colors rounded-sm w-fit select-none font-medium text-white"
					>
						Add Redirect
					</div>
				</div>
			</div>
		</div>
	);
};

interface IUriItemProps {
	uri: string;
}

const UriItem = ({ uri }: IUriItemProps) => {
	const [uriInput, setUriInput] = useState(uri ?? '');

	const handleInputOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUriInput(e.target.value);
	};

	return (
		<div className="relative">
			<div className="pr-8">
				<input
					value={uriInput}
					onChange={handleInputOnchange}
					type="text"
					className="bg-bgLightModeThird dark:bg-[#1e1f22] border w-full border-primary outline-none p-[10px] rounded-md"
				/>
			</div>
			<Icons.CloseButton className="absolute top-3 right-1 w-5 dark:text-gray-500 dark:hover:text-gray-400 text-gray-500 hover:text-gray-700 cursor-pointer" />
		</div>
	);
};

export default Redirects;
