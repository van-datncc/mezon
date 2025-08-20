import { useAuth } from '@mezon/core';
import { checkMutableRelationship, useAppDispatch } from '@mezon/store';
import { safeJSONParse } from 'mezon-js';
import { ApiIsFollowerResponse } from 'mezon-js/api.gen';
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddFriendPage() {
	const [searchParams] = useSearchParams();
	const data = searchParams.get('data');
	const { userProfile } = useAuth();
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

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result: ApiIsFollowerResponse = await dispatch(checkMutableRelationship({ userId: dataEncode?.id || '' })).unwrap();

				if (result.is_follower) {
					toast.success('You can chat now !!');
				}
			} catch (error) {
				console.error('Error:', error);
			}
		};

		fetchData();
	}, [dispatch, dataEncode?.id]);

	return (
		<div className="bg-theme-primary h-screen w-screen overflow-hidden flex items-center justify-center">
			<div className="bg-input-secondary min-w-[480px] w-2/5 h-4/5 max-h-80 rounded-lg flex flex-col gap-5 justify-center items-center p-8 text-white">
				<div className="rounded-xl p-4 w-fit h-fit bg-white">
					<img src={dataEncode?.avatar} className="w-24 h-24 rounded-full shadow-sm shadow-black" />
				</div>
				<p>Your friend request is on its way. Hang tight for their response!</p>
				<p className="text-2xl font-bold">{dataEncode?.name}</p>
			</div>
		</div>
	);
}
