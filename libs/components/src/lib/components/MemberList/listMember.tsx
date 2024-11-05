import { MemberProfileType, isWindowsDesktop } from '@mezon/utils';
import { selectClanMemberMetaUserId, selectClanMemberWithStatusIds, selectMemberClanByUserId2, selectTheme, useAppSelector } from '@mezon/store';
import { useVirtualizer } from '@tanstack/react-virtual';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import MemberItem from './MemberItem';

const heightTopBar = 60;
const titleBarHeight = isWindowsDesktop ? 21 : 0;

type MemberItemProps = {
	id: string;
};
const MemoizedMemberItem = memo((props: MemberItemProps) => {
	const { id } = props;
	const user = useAppSelector((state) => selectMemberClanByUserId2(state, id));
	const userMeta = useAppSelector((state) => selectClanMemberMetaUserId(state, id));

	return (
		<MemberItem
			user={user}
			name={user?.clan_nick || user?.user?.display_name || user?.user?.username}
			positionType={MemberProfileType.MEMBER_LIST}
			isDM={false}
			listProfile={true}
			isOffline={!userMeta?.online}
			isMobile={userMeta?.isMobile}
		/>
	);
});

const ListMember = () => {
	const members = useSelector(selectClanMemberWithStatusIds);
	const lisMembers = useMemo(() => {
		return [
			{ onlineSeparate: true },
			...members.online,
			{
				offlineSeparate: true
			},
			...members.offline
		];
	}, [members]);

	const [height, setHeight] = useState(window.innerHeight - heightTopBar - titleBarHeight);

	const appearanceTheme = useSelector(selectTheme);

	useEffect(() => {
		const handleResize = () => setHeight(window.innerHeight - heightTopBar - titleBarHeight);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const parentRef = useRef(null);
	const rowVirtualizer = useVirtualizer({
		count: lisMembers.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 48,
		overscan: 5
	});
	return (
		<div
			ref={parentRef}
			className={`custom-member-list ${appearanceTheme === 'light' ? 'customSmallScrollLightMode' : 'thread-scroll'}`}
			style={{
				height: height,
				overflow: 'auto'
			}}
		>
			<div
				style={{
					height: `${rowVirtualizer.getTotalSize()}px`,
					width: '100%',
					position: 'relative'
				}}
			>
				{rowVirtualizer.getVirtualItems().map((virtualRow) => {
					const user = lisMembers[virtualRow.index];
					return (
						<div
							key={virtualRow.index}
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: `${virtualRow.size}px`,
								transform: `translateY(${virtualRow.start}px)`
							}}
						>
							<div className="flex items-center px-4 h-full">
								{typeof user === 'object' && 'onlineSeparate' in user ? (
									<p className="dark:text-[#AEAEAE] text-black text-[14px] font-semibold flex items-center gap-[4px] font-title text-xs tracking-wide uppercase">
										Member - {members.online.length}
									</p>
								) : typeof user === 'object' && 'offlineSeparate' in user ? (
									<p className="dark:text-[#AEAEAE] text-black text-[14px] font-semibold flex items-center gap-[4px] font-title text-xs tracking-wide uppercase">
										Offline - {members.offline.length}
									</p>
								) : (
									<MemoizedMemberItem id={user} />
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ListMember;
