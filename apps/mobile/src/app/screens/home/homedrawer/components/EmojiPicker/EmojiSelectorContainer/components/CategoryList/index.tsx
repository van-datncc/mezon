import { ActionEmitEvent } from '@mezon/mobile-components';
import { baseColor, useTheme } from '@mezon/mobile-ui';
import { FC, ReactNode, memo, useEffect, useRef } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { Pressable, ScrollView } from 'react-native-gesture-handler';
import { style } from '../../styles';

type CategoryListProps = {
	categoriesWithIcons: Array<{
		name: string;
		icon: ReactNode;
	}>;
	selectedCategory: string;
};

const CategoryList: FC<CategoryListProps> = ({ categoriesWithIcons, selectedCategory }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const scrollViewRef = useRef<ScrollView>(null);

	useEffect(() => {
		if (!scrollViewRef?.current || !selectedCategory || categoriesWithIcons?.length === 0) return;
		const selectedIndex = categoriesWithIcons?.findIndex((item) => item?.name === selectedCategory);
		if (selectedIndex !== -1) {
			scrollViewRef.current.scrollTo({
				x: selectedIndex * 24,
				animated: false
			});
		}
	}, [selectedCategory, categoriesWithIcons]);

	return (
		<ScrollView
			ref={scrollViewRef}
			horizontal
			showsHorizontalScrollIndicator={false}
			style={styles.wrapperCateContainer}
			contentContainerStyle={styles.cateContainer}
		>
			{categoriesWithIcons?.length > 0 &&
				categoriesWithIcons.map((item, index) => (
					<Pressable
						key={`${item.name}_cate_emoji${index}`}
						onPress={() => DeviceEventEmitter.emit(ActionEmitEvent.ON_SCROLL_TO_CATEGORY_EMOJI, { name: item.name })}
						style={{
							...styles.cateItem,
							backgroundColor: item.name === selectedCategory ? baseColor.blurple : 'transparent'
						}}
					>
						{item.icon}
					</Pressable>
				))}
		</ScrollView>
	);
};

export default memo(CategoryList);
