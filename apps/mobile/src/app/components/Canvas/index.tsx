import { useTheme } from '@mezon/mobile-ui';
import { canvasAPIActions, selectCanvasIdsByChannelId, useAppDispatch, useAppSelector } from '@mezon/store-mobile';
import { normalizeString } from '@mezon/utils';
import { useNavigation } from '@react-navigation/native';
import { memo, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { APP_SCREEN } from '../../navigation/ScreenTypes';
import CanvasItem from './CanvasItem';
import CanvasSearch from './CanvasSearch';
import { style } from './styles';

const Canvas = memo(({ channelId, clanId }: { channelId: string; clanId: string }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const navigation = useNavigation<any>();
	const dispatch = useAppDispatch();
	const [searchText, setSearchText] = useState('');

	useEffect(() => {
		fetchCanvas();
	}, []);

	const fetchCanvas = async () => {
		if (channelId && clanId) {
			const body = {
				channel_id: channelId,
				clan_id: clanId
			};
			await dispatch(canvasAPIActions.getChannelCanvasList(body));
		}
	};

	const canvases = useAppSelector((state) => selectCanvasIdsByChannelId(state, channelId));

	const filterCanvas = useMemo(() => {
		return canvases.filter((canvas) =>
			normalizeString(canvas?.title ? canvas?.title?.replace(/\n/g, ' ') : 'Untitled').includes(normalizeString(searchText))
		);
	}, [canvases, searchText]);

	const handleSearchChange = (text) => {
		setSearchText(text);
	};

	return (
		<ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
			<CanvasSearch onSearchTextChange={handleSearchChange} />
			<View style={styles.container}>
				{filterCanvas?.map((item, index) => (
					<CanvasItem
						key={`canvas_${index}_${item?.id}`}
						canvas={item}
						onPressItem={() => {
							navigation.navigate(APP_SCREEN.MENU_CHANNEL.STACK, {
								screen: APP_SCREEN.MENU_CHANNEL.CANVAS,
								params: {
									channelId: channelId,
									clanId: clanId,
									canvasId: item?.id
								}
							});
						}}
					/>
				))}
			</View>
		</ScrollView>
	);
});

export default Canvas;
