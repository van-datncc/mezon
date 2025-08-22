import { useAuth } from '@mezon/core';
import { checkMutableRelationship, directActions, sendRequestAddFriend, useAppDispatch } from '@mezon/store';
import { Icons } from '@mezon/ui';
import { ChannelType, safeJSONParse } from 'mezon-js';
import { ApiCreateChannelDescRequest, ApiIsFollowerResponse } from 'mezon-js/api.gen';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddFriendPage() {
	const [searchParams] = useSearchParams();
	const { username } = useParams();
	const data = searchParams.get('data');
	const { userProfile } = useAuth();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const dataEncode: { id: string; name: string; avatar: string } | null | undefined = useMemo(() => {
		if (data) {
			try {
				const jsonStr = atob(data);
				const parsed = safeJSONParse(jsonStr);
				return parsed as { id: string; name: string; avatar: string };
			} catch (err) {
				console.error('Decode data error:', err);
				return null;
			}
		}
	}, [data]);

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			if (!dataEncode?.id || !userProfile?.user?.id) return;
			try {
				const result: ApiIsFollowerResponse = await dispatch(checkMutableRelationship({ userId: dataEncode?.id || '' })).unwrap();

				if (result.is_follower) {
					toast.success('You can chat now !!');
					const bodyCreateDm: ApiCreateChannelDescRequest = {
						type: ChannelType.CHANNEL_TYPE_DM,
						channel_private: 1,
						user_ids: [dataEncode?.id, userProfile?.user?.id],
						clan_id: '0'
					};
					dispatch(
						directActions.createNewDirectMessage({
							body: bodyCreateDm,
							username: [userProfile?.user?.display_name || userProfile?.user?.username || '', dataEncode?.name],
							avatar: [userProfile?.user?.avatar_url || '', dataEncode?.avatar]
						})
					);
				} else if (dataEncode?.id) {
					dispatch(
						sendRequestAddFriend({
							ids: [dataEncode?.id]
						})
					);
					navigate('/chat/direct/friends');
				}
				setLoading(false);
			} catch (error) {
				console.error('Error:', error);
			}
		};
		if (dataEncode?.id) {
			fetchData();
		} else {
			setError('It appears that the link you provided is not valid. Please check and try again.');
			setLoading(false);
		}
	}, [dispatch, dataEncode?.id, userProfile]);

	const navigateDeeplinkMobile = () => {
		try {
			const strData = `${username}?data=${data}`;
			window.location.href = `mezon.ai://invite/chat/${strData}`;
		} catch (e) {
			console.error('log  => navigateDeeplinkMobile error', e);
		}
	};

	useEffect(() => {
		navigateDeeplinkMobile();
	}, []);

	return (
		<div className="bg-theme-primary h-screen w-screen overflow-hidden flex items-center justify-center">
			<div className="bg-input-secondary min-w-[480px] w-2/5 h-4/5 h-fit rounded-lg flex flex-col gap-5 justify-center items-center p-8 text-white">
				{loading ? (
					<>
						<Icons.LoadingSpinner className="!w-20 !h-20" />
						<p className="italic text-sm ">( Please wait while we verify your information. This will only take a few seconds.)</p>
					</>
				) : (
					<>
						<div className="rounded-xl p-4 w-fit h-fit bg-white">
							<img src={dataEncode?.avatar} className="w-24 h-24 rounded-full shadow-sm shadow-black" />
						</div>
						<p className="text-2xl font-bold">{dataEncode?.name}</p>
						<CountDownNextPage />
						{error && <p className="text-red-500">{error}</p>}
						<p className="italic text-sm ">(You will be automatically redirected in 5 seconds.)</p>
					</>
				)}
			</div>
		</div>
	);
}
const CountDownNextPage = () => {
	const [count, setCount] = useState(5);
	const navigate = useNavigate();
	useEffect(() => {
		if (count > 0) {
			const timer = setTimeout(() => {
				setCount((prev) => prev - 1);
			}, 1000);

			return () => clearTimeout(timer);
		} else {
			navigate('/chat/direct/friends');
		}
	}, [count]);

	return (
		<div className="w-12 !h-12 rounded-full flex flex-col items-center justify-center text-theme-primary-active bg-theme-setting-nav">
			<p className="text-2xl">{count}</p>
		</div>
	);
};
