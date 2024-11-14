import { useTheme } from '@mezon/mobile-ui';
import { canvasAPIActions, selectCanvasIdsByChannelId, useAppDispatch, useAppSelector } from '@mezon/store-mobile';
import { useNavigation } from '@react-navigation/native';
import { memo, useEffect } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { APP_SCREEN } from '../../navigation/ScreenTypes';
import CanvasItem from './CanvasItem';
import { style } from './styles';

const Canvas = memo(({ channelId, clanId }: { channelId: string; clanId: string }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const navigation = useNavigation<any>();
	const dispatch = useAppDispatch();

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

	return (
		<ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
			<View style={styles.container}>
				{canvases?.map((item) => (
					<CanvasItem
						key={`canvas${item}`}
						channelId={channelId}
						canvasId={item}
						onPressItem={() => {
							navigation.navigate(APP_SCREEN.MENU_CHANNEL.STACK, {
								screen: APP_SCREEN.MENU_CHANNEL.CANVAS,
								params: {
									channelId: channelId,
									clanId: clanId,
									canvasId: item
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
