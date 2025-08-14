import { ActionEmitEvent, remove, save, STORAGE_CHANNEL_CURRENT_CACHE, STORAGE_CLAN_ID } from '@mezon/mobile-components';
import { baseColor, size, useTheme } from '@mezon/mobile-ui';
import { clansActions, directActions, getStoreAsync, selectOrderedClans, selectOrderedClansWithGroups, useAppDispatch } from '@mezon/store-mobile';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef } from 'react';
import { DeviceEventEmitter, TouchableOpacity, View } from 'react-native';
import { NestableDraggableFlatList } from 'react-native-draggable-flatlist';
import { useSelector } from 'react-redux';
import { ClanGroup } from '../../../../../components/ClanGroup';
import MezonIconCDN from '../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../constants/icon_cdn';
import useTabletLandscape from '../../../../../hooks/useTabletLandscape';
import { APP_SCREEN } from '../../../../../navigation/ScreenTypes';
import { ClanIcon } from '../ClanIcon';
import CreateClanModal from '../CreateClanModal';
import { style } from './styles';

const GROUP = 'group';
const CLAN = 'clan';
const DISTANCE_OFFSET = 10;

export const ListClanPopup = React.memo(() => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const timerRef = useRef(null);
	const navigation = useNavigation();
	const isTabletLandscape = useTabletLandscape();
	const dispatch = useAppDispatch();
	const orderedClansWithGroups = useSelector(selectOrderedClansWithGroups);
	const clans = useSelector(selectOrderedClans);
	const actualDragDistanceRef = useRef<number | null>(null);
	const iconDimensionsRef = useRef<{ width: number; height: number } | null>(null);
	const animationValuesRef = useRef<any>(null);
	const indexDiffRef = useRef<number | null>(null);
	const thresholdRef = useRef<number | null>(null);
	const releaseYRef = useRef<number | null>(null);

	useEffect(() => {
		return () => {
			timerRef?.current && clearTimeout(timerRef.current);
		};
	}, []);

	useEffect(() => {
		dispatch(clansActions.initializeClanGroupOrder());
	}, []);

	const onCreateClanModal = useCallback(() => {
		const data = {
			children: <CreateClanModal />
		};
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: false, data });
	}, []);

	const handleAnimValInit = useCallback((animVals: any) => {
		animationValuesRef.current = animVals;
	}, []);

	const getIconLayout = useCallback((dimensions: { width: number; height: number }) => {
		iconDimensionsRef.current = dimensions;
	}, []);

	const calculateDynamicThreshold = () => {
		const minDistance = iconDimensionsRef.current?.height;
		const maxDistance = minDistance * 2;
		return ((minDistance + maxDistance) / 2) * indexDiffRef.current;
	};

	const handleRelease = useCallback(() => {
		if (animationValuesRef.current) {
			releaseYRef.current = animationValuesRef.current?.touchTranslate?.value || 0;
		}
	}, []);

	const handleDragBegin = useCallback((index: number) => {
		actualDragDistanceRef.current = null;
		indexDiffRef.current = null;
		releaseYRef.current = null;
	}, []);

	const handleDragEnd = useCallback(
		({ data, from, to }) => {
			if (from === to) {
				return;
			}

			try {
				if (releaseYRef.current !== null) {
					indexDiffRef.current = Math.abs(to - from);
					thresholdRef.current = calculateDynamicThreshold();
					const multiIndexDistanceOffset = DISTANCE_OFFSET * indexDiffRef.current;
					actualDragDistanceRef.current = Math.abs(releaseYRef.current) + DISTANCE_OFFSET + multiIndexDistanceOffset;
				}

				const currentData = orderedClansWithGroups || [];
				const fromItem = currentData?.[from];
				const toItem = currentData?.[to];

				if (
					actualDragDistanceRef.current >= thresholdRef.current ||
					(fromItem?.type === GROUP && toItem?.type === GROUP) ||
					(fromItem?.type === GROUP && toItem?.type === CLAN)
				) {
					const newClanGroupOrder = data?.map((item) => {
						if (item?.type === GROUP) {
							return {
								type: GROUP,
								id: item?.id,
								groupId: item?.group?.id
							};
						} else if (item?.type === CLAN) {
							return {
								type: CLAN,
								id: item?.id,
								clanId: item?.clan?.clan_id
							};
						}
					});

					dispatch(clansActions.updateClanGroupOrder(newClanGroupOrder));
				} else if (actualDragDistanceRef.current < thresholdRef.current) {
					requestAnimationFrame(() => {
						if (fromItem?.type === CLAN && toItem?.type === GROUP) {
							dispatch(
								clansActions.addClanToGroup({
									groupId: toItem?.group?.id,
									clanId: fromItem?.clan?.clan_id
								})
							);
						} else if (fromItem?.type === CLAN && toItem?.type === CLAN) {
							dispatch(
								clansActions.createClanGroup({
									clanIds: [fromItem?.clan?.clan_id, toItem?.clan?.clan_id]
								})
							);
						}
					});
				}
				releaseYRef.current = null;
			} catch (error) {
				console.error('Error in handleDragEnd', error);
			}
		},
		[orderedClansWithGroups]
	);

	const handleChangeClan = useCallback(
		async (clanId: string) => {
			const store = await getStoreAsync();
			if (isTabletLandscape) {
				navigation.navigate(APP_SCREEN.HOME as never);
				store.dispatch(directActions.setDmGroupCurrentId(''));
			}
			await remove(STORAGE_CHANNEL_CURRENT_CACHE);
			save(STORAGE_CLAN_ID, clanId);
			store.dispatch(clansActions.setCurrentClanId(clanId));
			requestAnimationFrame(async () => {
				const promises = [];
				promises.push(store.dispatch(clansActions.joinClan({ clanId: clanId })));
				promises.push(store.dispatch(clansActions.changeCurrentClan({ clanId: clanId })));
				await Promise.allSettled(promises);
			});
		},
		[isTabletLandscape, navigation]
	);

	const renderItem = ({ item, drag, isActive }) => {
		if (item?.type === GROUP) {
			return (
				<ClanGroup
					key={`group-${item?.group?.id}`}
					group={item?.group}
					onClanPress={handleChangeClan}
					clans={clans}
					drag={drag}
					isActive={isActive}
				/>
			);
		} else if (item?.type === CLAN) {
			return (
				<ClanIcon
					key={`clan-${item?.clan?.clan_id}`}
					data={item?.clan}
					onPress={handleChangeClan}
					drag={drag}
					isActive={isActive}
					onLayout={getIconLayout}
				/>
			);
		}
	};

	return (
		<View style={styles.clansBox}>
			<NestableDraggableFlatList
				initialNumToRender={10}
				maxToRenderPerBatch={10}
				windowSize={10}
				scrollEnabled={false}
				removeClippedSubviews={false}
				data={orderedClansWithGroups || []}
				keyExtractor={(item, index) => `${item?.id}_${index}_item`}
				onDragBegin={handleDragBegin}
				onDragEnd={handleDragEnd}
				onAnimValInit={handleAnimValInit}
				onRelease={handleRelease}
				renderItem={renderItem}
				ListEmptyComponent={<View />}
				ListFooterComponent={() => {
					return (
						<TouchableOpacity style={styles.createClan} onPress={onCreateClanModal}>
							<View style={styles.wrapperPlusClan}>
								<MezonIconCDN icon={IconCDN.plusLargeIcon} color={baseColor.blurple} width={size.s_18} height={size.s_18} />
							</View>
						</TouchableOpacity>
					);
				}}
				activationDistance={40}
			/>
		</View>
	);
});
