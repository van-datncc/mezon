import { ActionEmitEvent, remove, save, STORAGE_CHANNEL_CURRENT_CACHE, STORAGE_CLAN_ID } from '@mezon/mobile-components';
import { baseColor, size, useTheme } from '@mezon/mobile-ui';
import { clansActions, directActions, getStoreAsync, selectOrderedClans, selectOrderedClansWithGroups, useAppDispatch } from '@mezon/store-mobile';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, TouchableOpacity, View } from 'react-native';
import { NestableDraggableFlatList } from 'react-native-draggable-flatlist';
import { useSelector } from 'react-redux';
import { ClanGroup } from '../../../../../components/ClanGroup';
import { ClanGroupPreview } from '../../../../../components/ClanGroupPreview';
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
const PREVIEW_DEBOUNCE_MS = 1000;

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
	const thresholdRef = useRef<number | null>(null);
	const releaseYRef = useRef<number | null>(null);
	const dragIndexRef = useRef<number | null>(null);
	const placeholderIndexRef = useRef<number | null>(null);
	const groupPreviewIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [previewTargetIndex, setPreviewTargetIndex] = useState<number | null>(null);

	useEffect(() => {
		return () => {
			timerRef?.current && clearTimeout(timerRef.current);
		};
	}, []);

	useEffect(() => {
		dispatch(clansActions.initializeClanGroupOrder());
	}, []);

	useEffect(() => {
		if (isDragging && dragIndexRef.current !== null && placeholderIndexRef.current !== null) {
			groupPreviewIntervalRef.current = setInterval(() => {
				checkCanGroupRealTime();
			}, PREVIEW_DEBOUNCE_MS);
		}

		return () => {
			if (groupPreviewIntervalRef.current) {
				clearInterval(groupPreviewIntervalRef.current);
				groupPreviewIntervalRef.current = null;
			}
		};
	}, [isDragging]);

	const checkCanGroupRealTime = () => {
		if (!isDragging || dragIndexRef.current === null || placeholderIndexRef.current === null) {
			return;
		}

		const currentData = orderedClansWithGroups || [];
		const fromItem = currentData[dragIndexRef.current];
		const toItem = currentData[placeholderIndexRef.current];

		if (!fromItem || !toItem) return;

		let currentDragDistance = 0;
		if (animationValuesRef.current?.touchTranslate?.value) {
			const indexDiff = Math.abs(placeholderIndexRef.current - dragIndexRef.current);
			const multiIndexDistanceOffset = DISTANCE_OFFSET * indexDiff;
			currentDragDistance = Math.abs(animationValuesRef.current.touchTranslate.value) + DISTANCE_OFFSET + multiIndexDistanceOffset;
		}

		const currentThreshold = calculateDynamicThreshold(dragIndexRef.current, placeholderIndexRef.current);
		const canGroup = fromItem?.type === CLAN && (toItem?.type === GROUP || toItem?.type === CLAN) && currentDragDistance < currentThreshold;
		const newPreviewIndex = canGroup ? placeholderIndexRef.current : null;
		newPreviewIndex !== previewTargetIndex ? setPreviewTargetIndex(newPreviewIndex) : setPreviewTargetIndex(null);
	};

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

	const calculateDynamicThreshold = (from: number, to: number) => {
		const currentData = orderedClansWithGroups || [];
		const minDistance = iconDimensionsRef.current?.height;
		const maxDistance = minDistance * 2;
		const fromIndex = Math.min(from, to);
		const toIndex = Math.max(from, to);
		const indexDiff = Math.abs(to - from);
		const baseThreshold = (minDistance + maxDistance) / 2;

		try {
			let expandedGroupsCount = 0;
			let expandedGroupsItemCount = 0;

			currentData.slice(fromIndex, toIndex + 1).forEach((item) => {
				if (item?.type === GROUP && item?.group?.clanIds?.length > 0 && item?.group?.isExpanded) {
					expandedGroupsCount++;
					expandedGroupsItemCount += 1 + item.group.clanIds.length;
				}
			});

			if (expandedGroupsItemCount > 0) {
				const adjustedIndexDiff = indexDiff - expandedGroupsCount;
				const thresholdMultiplier = expandedGroupsItemCount + adjustedIndexDiff;
				return baseThreshold * thresholdMultiplier;
			}

			return baseThreshold * indexDiff;
		} catch (error) {
			console.error('Error in calculateDynamicThreshold: ', error);
			return 0;
		}
	};

	const handlePlaceholderIndexChange = useCallback(
		(placeholderIndex: number) => {
			if (!isDragging) return;
			placeholderIndexRef.current = placeholderIndex;
		},
		[isDragging]
	);

	const handleRelease = useCallback(() => {
		if (animationValuesRef.current?.touchTranslate?.value) {
			releaseYRef.current = animationValuesRef.current.touchTranslate.value;
		}
	}, []);

	const handleDragBegin = useCallback((index: number) => {
		setIsDragging(true);
		dragIndexRef.current = index;
		placeholderIndexRef.current = index;
	}, []);

	const handleDragEnd = useCallback(
		({ data, from, to }) => {
			setIsDragging(false);
			dragIndexRef.current = null;
			placeholderIndexRef.current = null;
			setPreviewTargetIndex(null);
			if (from === to) {
				return;
			}

			try {
				if (releaseYRef.current !== null) {
					const indexDiff = Math.abs(to - from);
					thresholdRef.current = calculateDynamicThreshold(from, to);
					const multiIndexDistanceOffset = DISTANCE_OFFSET * indexDiff;
					actualDragDistanceRef.current = Math.abs(releaseYRef.current) + DISTANCE_OFFSET + multiIndexDistanceOffset;
				}

				const currentData = orderedClansWithGroups || [];
				const fromItem = currentData[from];
				const toItem = currentData[to];

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
			} catch (error) {
				console.error('Error in handleDragEnd', error);
			} finally {
				releaseYRef.current = null;
				actualDragDistanceRef.current = null;
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

	const renderItem = ({ item, drag, isActive, getIndex }) => {
		const currentIndex = getIndex();
		const currentData = orderedClansWithGroups || [];
		const isRenderPreview = previewTargetIndex === currentIndex;

		if (item?.type === GROUP) {
			return (
				<View>
					<ClanGroup
						key={`group-${item?.group?.id}`}
						group={item?.group}
						onClanPress={handleChangeClan}
						clans={clans}
						drag={drag}
						isActive={isActive}
					/>
					{isRenderPreview && (
						<ClanGroupPreview targetItem={currentData[previewTargetIndex]} dragItem={currentData[dragIndexRef.current]} clans={clans} />
					)}
				</View>
			);
		} else if (item?.type === CLAN) {
			return (
				<View>
					<ClanIcon
						key={`clan-${item?.clan?.clan_id}`}
						data={item?.clan}
						onPress={handleChangeClan}
						drag={drag}
						isActive={isActive}
						onLayout={getIconLayout}
					/>
					{isRenderPreview && (
						<ClanGroupPreview targetItem={currentData[previewTargetIndex]} dragItem={currentData[dragIndexRef.current]} clans={clans} />
					)}
				</View>
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
				onPlaceholderIndexChange={handlePlaceholderIndexChange}
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
