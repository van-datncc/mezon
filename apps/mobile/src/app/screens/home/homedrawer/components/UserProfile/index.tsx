import { useAuth, useMemberStatus, useRoles } from '@mezon/core';
import { CallIcon, CloseIcon, MessageIcon, VideoIcon } from '@mezon/mobile-components';
import { Metrics, size } from '@mezon/mobile-ui';
import { selectCurrentChannelId, selectMemberByUserId } from '@mezon/store-mobile';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ImageColors from 'react-native-image-colors';
import { useSelector } from 'react-redux';
import MezonAvatar from '../../../../../../app/temp-ui/MezonAvatar';
import { styles } from './UserProfile.styles';

interface userProfileProps {
	userId: string;
}

const UserProfile = ({ userId }: userProfileProps) => {
	const { userProfile } = useAuth();
	const currentChannelId = useSelector(selectCurrentChannelId);
	const { t } = useTranslation(['userProfile']);
	const userById = useSelector(selectMemberByUserId(userId ?? ''));
	const [color, setColor] = useState<string>('#323232');
	const userStatus = useMemberStatus(userId || '');
	const { RolesClan } = useRoles(currentChannelId || '');

	const checkUrl = (url: string | undefined) => {
		if (url !== undefined && url !== '') return true;
		return false;
	};
	const getColor = useCallback(async () => {
		if (checkUrl(userProfile?.user?.avatar_url) && checkUrl(userById?.user?.avatar_url)) {
			const imageUrl = userById?.user?.avatar_url;

			try {
				const result = await ImageColors.getColors(imageUrl, {
					fallback: '#323232',
					cache: true,
					key: imageUrl,
				});

				switch (result.platform) {
					case 'android':
						setColor(result.dominant);
						break;
					case 'ios':
						setColor(result.background);
						break;
				}
			} catch (error) {
				console.error(error);
			}
		}
	}, [userProfile?.user?.avatar_url, userById?.user?.avatar_url]);

	useEffect(() => {
		getColor();
	}, []);

	const userRolesClan = useMemo(() => {
		return userById?.role_id ? RolesClan.filter((role) => userById?.role_id?.includes(role.id)) : [];
	}, [userById?.role_id, RolesClan]);

	const checkOwner = (userId: string) => {
		return userId === userProfile?.user?.google_id;
	};

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			style={{ height: Metrics.screenHeight / (Platform.OS === 'ios' ? 1.4 : 1.3) }}
			contentContainerStyle={{ paddingBottom: size.s_10 }}
		>
			<View style={[styles.wrapper]}>
				<View style={[styles.backdrop, { backgroundColor: color }]}>
					<View style={[styles.userAvatar]}>
						<MezonAvatar
							width={80}
							height={80}
							avatarUrl={userById?.user?.avatar_url}
							userName={userById?.user?.username}
							userStatus={userStatus}
						/>
					</View>
				</View>
				<View style={[styles.container]}>
					<View style={[styles.userInfo]}>
						<Text style={[styles.userName]}>{userById?.user?.username}</Text>
						<Text style={[styles.subUserName]}>{userById?.user?.display_name}</Text>
						{!checkOwner(userById?.user?.google_id || '') && (
							<View style={[styles.userAction]}>
								<View style={[styles.actionItem]}>
									<MessageIcon width={20} height={20}></MessageIcon>
									<Text style={[styles.actionText]}>{t('userAction.sendMessage')}</Text>
								</View>
								<View style={[styles.actionItem]}>
									<CallIcon width={20} height={20}></CallIcon>
									<Text style={[styles.actionText]}>{t('userAction.voiceCall')}</Text>
								</View>
								<View style={[styles.actionItem]}>
									<VideoIcon width={20} height={20}></VideoIcon>
									<Text style={[styles.actionText]}>{t('userAction.videoCall')}</Text>
								</View>
							</View>
						)}
					</View>
					<View style={[styles.userInfo]}>
						<Text style={[styles.aboutMe]}>{t('aboutMe.headerTitle')}</Text>
						<Text style={[styles.title]}>{t('aboutMe.roles.headerTitle')}</Text>
						<View style={[styles.roles]}>
							{userRolesClan.length
								? userRolesClan.map((role, index) => (
										<View style={[styles.roleItem]} key={`${role.id}_${index}`}>
											<CloseIcon width={15} height={15}></CloseIcon>
											<Text style={[styles.textRole]}>{role?.title}</Text>
										</View>
									))
								: null}
						</View>
					</View>
				</View>
			</View>
		</ScrollView>
	);
};

export default UserProfile;
