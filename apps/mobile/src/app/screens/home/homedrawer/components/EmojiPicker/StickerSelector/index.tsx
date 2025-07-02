import { Metrics, size, useTheme } from '@mezon/mobile-ui';
import { MediaType, getStore, selectAllStickerSuggestion } from '@mezon/store-mobile';
import { memo, useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ScrollView } from 'react-native-gesture-handler';
import MezonIconCDN from '../../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../../constants/icon_cdn';
import Sticker from './Sticker';
import { style } from './styles';

type StickerSelectorProps = {
	onSelected?: (url: string) => void;
	onScroll?: (e: any) => void;
	mediaType?: MediaType;
	searchText?: string;
};
interface ICategory {
	type: string;
	forSale: boolean;
}

const StickerSelector = ({ onSelected, onScroll, mediaType = MediaType.STICKER, searchText }: StickerSelectorProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

	const isAudio = useMemo(() => mediaType === MediaType.AUDIO, [mediaType]);

	const clanStickers = useMemo(() => {
		const store = getStore();
		const allStickers = selectAllStickerSuggestion(store.getState());
		if (mediaType === MediaType.AUDIO) {
			return allStickers?.filter((sticker) => (sticker as any).media_type === MediaType.AUDIO);
		}
		return allStickers?.filter((sticker) => (sticker as any).media_type === undefined || (sticker as any).media_type === MediaType.STICKER);
	}, [mediaType]);

	const filteredStickers = useMemo(() => {
		if (!searchText?.trim()) return clanStickers;
		
		const lowerCaseSearchTerm = searchText.trim().toLowerCase();
		return clanStickers?.filter((item) => 
			item?.shortname?.toLowerCase().includes(lowerCaseSearchTerm)
		);
	}, [clanStickers, searchText]);

	const categoryLogo = useMemo(() => {
		if (filteredStickers?.length === 0) return [];

		const uniqueCategories = new Map();
		const result = [];

		for (const sticker of filteredStickers) {
			const item = {
				id: sticker?.clan_id,
				type: sticker?.clan_name,
				url: sticker?.is_for_sale ? null : sticker?.logo,
				forSale: sticker?.is_for_sale
			};

			const key = item?.forSale ? 'FOR_SALE_SYSTEM' : `${item?.id}_${item?.type}_${item?.forSale}`;

			if (!uniqueCategories.has(key)) {
				uniqueCategories.set(key, true);
				result.push(item);
			}
		}

		return result.sort((a, b) => Number(b?.forSale === true) - Number(a?.forSale === true));
	}, [filteredStickers]);

	const stickers = useMemo(
		() =>{
			if (filteredStickers?.length === 0) return [];
			return [
				...filteredStickers?.map((sticker) => ({
					id: sticker?.id,
					url: sticker?.source,
					type: sticker?.clan_name,
					name: sticker?.shortname,
					forSale: sticker?.is_for_sale
				}))
			].filter(Boolean);
		},
		[filteredStickers]
	);

	const handlePressCategory = (category: ICategory) => {
		setSelectedCategory(category);
	};

	const handleClickImage = (sticker: any) => {
		onSelected && onSelected(sticker);
	};

	useEffect(() => {
		setSelectedCategory(null);
	}, [mediaType]);

	return (
		<ScrollView
			scrollEventThrottle={16}
			onScroll={onScroll}
			style={{ maxHeight: Metrics.screenHeight / 1.07 }}
			contentContainerStyle={{ paddingBottom: size.s_10 * 2 }}
		>
			<ScrollView horizontal contentContainerStyle={styles.btnWrap}>
				{categoryLogo?.length > 0 && categoryLogo?.map((item, index) => (
					<TouchableOpacity key={index.toString()} onPress={() => handlePressCategory(item)} style={styles.btnEmo}>
						{item?.forSale ? (
							<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
								<MezonIconCDN icon={IconCDN.shopSparkleIcon} color={themeValue.textStrong} />
							</View>
						) : item?.url ? (
							<FastImage
								resizeMode={FastImage.resizeMode.cover}
								source={{
									uri: item?.url,
									cache: FastImage.cacheControl.immutable,
									priority: FastImage.priority.high
								}}
								style={{ height: '100%', width: '100%' }}
							/>
						) : (
							<View style={styles.forSaleContainer}>
								<Text style={styles.forSaleText}>{item?.type?.charAt(0)?.toUpperCase()}</Text>
							</View>
						)}
					</TouchableOpacity>
				))}
			</ScrollView>

			{!selectedCategory
				? categoryLogo?.length > 0 && categoryLogo?.map((item, index) => (
						<Sticker
							key={`${index}_${item?.type}`}
							stickerList={stickers}
							onClickSticker={handleClickImage}
							categoryName={item?.type}
							categoryForSale={item?.forSale}
							isAudio={isAudio}
						/>
					))
				: [
						<Sticker
							key={`selected_${selectedCategory?.type}`}
							stickerList={stickers}
							onClickSticker={handleClickImage}
							categoryName={selectedCategory?.type}
							categoryForSale={selectedCategory?.forSale}
							isAudio={isAudio}
						/>
					]}
		</ScrollView>
	);
};

export default memo(StickerSelector);
