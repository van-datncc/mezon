import { baseColor, useTheme } from '@mezon/mobile-ui';
import { useCallback, useEffect, useState } from 'react';
import { GestureResponderEvent, LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import { style } from './style';

interface IPos {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface IProps {
	pageID: number;
	onChange?: (pageID: number) => void;
	tabList: {
    title: string,
    numberSearch: number,
    isDisplay: boolean,
    index: number
  }[];
  numberSearch?: number;
}

const usePos = (): [IPos[], (event: LayoutChangeEvent, index: number, isDisplay: boolean) => void] => {
	const [pos, setPos] = useState<IPos[]>([]);
	const onLayout = useCallback((event: LayoutChangeEvent, index: number) => {
		const { width, height, x, y } = event.nativeEvent.layout;
		setPos((p) => {
			const tmp = p.slice();
			tmp[index] = { x, y, width, height };
			return tmp;
		});
	}, []);

	return [pos, onLayout];
};

export default function AssetsHeader({ pageID = 0, onChange, tabList = [] }: IProps) {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const [pos, onLayout] = usePos();
	const [selected, setSelected] = useState<number>(pageID);

	useEffect(() => {
		setSelected(pageID);
	}, [pageID]);

	function handlePress(event: GestureResponderEvent, index: number) {
		onChange && onChange(index);
	}

	return (
		<>
			<View style={styles.headerTab}>
				{tabList?.map((tab, index) => (
				tab?.isDisplay ? 	<Pressable key={index.toString()} onLayout={(e) => onLayout(e, tab?.index, tab?.isDisplay)} onPress={(e) => handlePress(e, tab?.index)}>
        <Text style={{ color: tab?.index === selected ? baseColor.blurple : themeValue.text }}>{tab?.title} {tab?.numberSearch ? `(${tab?.numberSearch})`: ''}</Text>
      </Pressable> : null
				))}
			</View>

			{pos?.length > selected && (
				<View style={styles.a}>
					<View
						style={{
							...styles.b,
							width: pos[selected]?.width || 0,
							left: pos[selected]?.x || 0,
						}}
					></View>
				</View>
			)}
		</>
	);
}
