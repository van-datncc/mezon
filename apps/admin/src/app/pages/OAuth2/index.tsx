import { ModalSaveChanges } from '@mezon/components';
import { editMezonOauthClient, selectApplicationById, selectCurrentAppId, useAppDispatch } from '@mezon/store';
import { ApiMezonOauthClient } from 'mezon-js/api.gen';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ClientInformation from './ClientInformation/ClientInfomation';
import Generator from './Generator/Generator';
import Redirects from './Redirects/Redirects';

const OAuth2 = () => {
	const dispatch = useAppDispatch();
	const [hasChange, setHasChange] = useState(false);
	const currentAppId = useSelector(selectCurrentAppId);
	const currentApp = useSelector((state) => selectApplicationById(state, currentAppId as string)) ?? {};

	//For Redirects URIs
	const appURIes = currentApp?.oAuthClient?.redirect_uris ?? [];
	const uriInputValuesRef = useRef<string[]>([...appURIes]);
	const [inputArrLength, setInputArrLength] = useState<number>(appURIes.length);

	useEffect(() => {
		const isSameURIArray =
			appURIes.length === uriInputValuesRef.current.length && JSON.stringify(appURIes) === JSON.stringify(uriInputValuesRef.current);
		if (!isSameURIArray || inputArrLength !== appURIes.length) {
			setHasChange(true);
			return;
		}
		setHasChange(false);
	}, [appURIes, inputArrLength, uriInputValuesRef.current]);

	const handleSaveChanges = async () => {
		if (!uriInputValuesRef.current || uriInputValuesRef.current.includes('')) {
			toast.warning('There is empty input!');
			return;
		}

		for (let index = 0; index < uriInputValuesRef.current.length; index++) {
			const item = uriInputValuesRef.current[index];
			if (!item.startsWith('http://') && !item.startsWith('https://')) {
				toast.warning('URIs must be valid!');
				break;
			}
		}

		const request: ApiMezonOauthClient = {
			...currentApp?.oAuthClient,
			redirect_uris: uriInputValuesRef.current
		};

		await dispatch(editMezonOauthClient({ body: request }));
		setHasChange(false);
	};

	const handleResetChanges = () => {
		uriInputValuesRef.current = [...appURIes];
		setInputArrLength(appURIes.length);
		setHasChange(false);
	};

	return (
		<div className="flex flex-col gap-10">
			<div className="flex gap-5 flex-col">
				<div className="text-2xl font-semibold">OAuth2</div>
				<div className="text-xl dark:text-[#b5bac1] text-[#4e5058]">
					Use Mezon as an authorization system or use our API on behalf of your users. Add a redirect URI, pick your scopes, roll a D20 for
					good luck, and go!
				</div>
				<div className="text-blue-500 cursor-pointer">Learn more about OAuth2</div>
			</div>
			<ClientInformation currentApp={currentApp} />
			<Redirects
				inputArrLength={inputArrLength}
				uriInputValuesRef={uriInputValuesRef}
				setInputArrLength={setInputArrLength}
				currentApp={currentApp}
			/>
			<Generator />
			{hasChange && <ModalSaveChanges onReset={handleResetChanges} onSave={handleSaveChanges} />}
		</div>
	);
};

export default OAuth2;
