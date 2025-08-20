import { Colors, size, useTheme } from '@mezon/mobile-ui';
import { ClanGroup as ClanGroupType, clansActions, useAppDispatch } from '@mezon/store-mobile';
import { createImgproxyUrl } from '@mezon/utils';
import React, { memo, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import MezonIconCDN from '../../componentUI/MezonIconCDN';
import { IconCDN } from '../../constants/icon_cdn';
import { ClanIcon } from '../../screens/home/homedrawer/components/ClanIcon';
import ImageNative from '../ImageNative';
import { style } from './styles';

interface ClanGroupProps {
	group: ClanGroupType;
	onClanPress: (clanId: string) => void;
	clans: any[];
	drag: () => void;
	isActive?: boolean;
}

export const ClanGroup = memo(({ group, onClanPress, clans, drag, isActive }: ClanGroupProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue, Colors);
	const dispatch = useAppDispatch();

	const groupClans = useMemo(() => {
		if (!group?.clanIds?.length) return [];

		try {
			return group.clanIds.reduce((acc: any[], clanId) => {
				const clan = clans?.find((clan) => clan?.clan_id === clanId);
				if (clan) acc.push(clan);
				return acc;
			}, []);
		} catch (error) {
			console.error('Error in groupClans: ', error);
			return [];
		}
	}, [group?.clanIds, clans]);

	const totalBadgeCount = useMemo(() => {
		if (!group?.clanIds?.length) return 0;

		try {
			return group.clanIds.reduce((total, clanId) => {
				const clan = clans?.find((c) => c?.clan_id === clanId);
				return total + (clan?.badge_count || 0);
			}, 0);
		} catch (error) {
			console.error('Error in totalBadgeCount: ', error);
			return 0;
		}
	}, [group?.clanIds, clans]);

	const handleRemoveClanFromGroup = (clanId: string) => {
		if (group?.id && clanId) {
			dispatch(clansActions.removeClanFromGroup({ groupId: group.id, clanId }));
		}
	};

	const handleToggleGroup = () => {
		if (group?.id) {
			dispatch(clansActions.toggleGroupExpanded(group.id));
		}
	};

	if (!groupClans?.length) {
		return null;
	}

	const renderClanContent = (clan: any) => {
		return (
			<View>
				{clan?.logo ? (
					<View style={{ overflow: 'hidden', borderRadius: 10 }}>
						<ImageNative
							url={createImgproxyUrl(clan?.logo, { width: 100, height: 100, resizeType: 'fit' })}
							style={{ width: '100%', height: '100%' }}
							resizeMode="cover"
						/>
					</View>
				) : (
					<View style={styles.clanIcon}>
						<Text style={styles.clanIconText}>{clan?.clan_name?.charAt(0)?.toUpperCase()}</Text>
					</View>
				)}
			</View>
		);
	};

	if (group?.isExpanded) {
		return (
			<View style={styles.expandedGroup}>
				<TouchableOpacity style={styles.groupHeader} onPress={handleToggleGroup}>
					<MezonIconCDN icon={IconCDN.forderIcon} width={size.s_20} height={size.s_20} color={themeValue.text} />
				</TouchableOpacity>

				{groupClans?.map((clan) => (
					<View key={`${clan?.clan_id}-expanded-container`} style={styles.clanContainer}>
						<ClanIcon key={`${clan?.clan_id}-expanded`} data={clan} onPress={onClanPress} drag={undefined} isActive={false} />
						<TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveClanFromGroup(clan?.clan_id)}>
							<MezonIconCDN icon={IconCDN.closeIcon} width={size.s_16} height={size.s_16} color={themeValue.textStrong} />
						</TouchableOpacity>
					</View>
				))}
			</View>
		);
	}

	return (
		<ScaleDecorator activeScale={1.5}>
			<TouchableOpacity style={styles.collapsedGroup} onPress={handleToggleGroup} onLongPress={drag} disabled={isActive}>
				<View style={styles.groupIcon}>
					<View style={[styles.multipleClansView, groupClans.length === 1 && styles.singleClanView]}>
						{groupClans?.slice(0, 4)?.map((clan) => (
							<View key={`${clan?.clan_id}-collapsed`} style={styles.quarterClan}>
								{renderClanContent(clan)}
							</View>
						))}
					</View>
					{totalBadgeCount > 0 && (
						<View style={styles.badge}>
							<Text style={styles.badgeText}>{totalBadgeCount > 99 ? '99+' : totalBadgeCount}</Text>
						</View>
					)}
				</View>
			</TouchableOpacity>
		</ScaleDecorator>
	);
});
