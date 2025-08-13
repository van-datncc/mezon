import { Colors, size, useTheme } from '@mezon/mobile-ui';
import { ClanGroup as ClanGroupType, clansActions, useAppDispatch } from '@mezon/store-mobile';
import { createImgproxyUrl } from '@mezon/utils';
import { CloseSmallIcon, FolderIcon } from 'libs/mobile-components/src/lib/icons2';
import React, { memo, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import FastImage from 'react-native-fast-image';
import { ClanIcon } from '../../screens/home/homedrawer/components/ClanIcon';
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
	const groupClans = group?.clanIds?.map((clanId) => clans?.find((clan) => clan?.clan_id === clanId));

	const totalBadgeCount = useMemo(() => {
		if (!group?.clanIds) return 0;

		return group.clanIds.reduce((total, clanId) => {
			const clan = clans?.find((c) => c?.clan_id === clanId);
			return total + (clan?.badge_count || 0);
		}, 0);
	}, [group?.clanIds, clans]);

	const handleRemoveClanFromGroup = (clanId: string) => {
		dispatch(clansActions.removeClanFromGroup({ groupId: group?.id, clanId }));
	};

	const handleToggleGroup = () => {
		if (group?.clanIds?.length === 1) {
			handleRemoveClanFromGroup(group?.clanIds?.[0]);
		}
		dispatch(clansActions.toggleGroupExpanded(group?.id));
	};

	const renderClanContent = (clan: any) => {
		return (
			<View>
				{clan?.logo ? (
					<FastImage
						source={{ uri: createImgproxyUrl(clan?.logo, { width: 100, height: 100, resizeType: 'fit' }) }}
						style={{ width: '100%', height: '100%', borderRadius: 10 }}
						resizeMode="cover"
					/>
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
					<FolderIcon width={size.s_24} height={size.s_24} color={themeValue.text} />
				</TouchableOpacity>

				{groupClans?.map((clan) => (
					<View key={`${clan?.clan_id}-expanded-container`} style={styles.clanContainer}>
						<ClanIcon key={`${clan?.clan_id}-expanded`} data={clan} onPress={onClanPress} drag={undefined} isActive={false} />
						<TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveClanFromGroup(clan?.clan_id)}>
							<CloseSmallIcon width={size.s_16} height={size.s_16} color={Colors.red} />
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
					<View style={styles.multipleClansView}>
						{groupClans?.slice(0, groupClans?.length === 2 ? 2 : 4)?.map((clan) => (
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
