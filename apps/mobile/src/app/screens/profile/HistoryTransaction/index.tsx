import { baseColor, size, useTheme } from '@mezon/mobile-ui';
import { fetchListWalletLedger, selectWalletLedger, selectWalletLedgerCursors, useAppDispatch, useAppSelector } from '@mezon/store-mobile';
import { formatNumber } from '@mezon/utils';
import { FlashList } from '@shopify/flash-list';
import { ApiWalletLedger } from 'mezon-js/api.gen';
import moment from 'moment';
import { useEffect } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SeparatorWithLine } from '../../../components/Common';
import { APP_SCREEN, SettingScreenProps } from '../../../navigation/ScreenTypes';
import { style } from './styles';

type ScreenHistoryTransaction = typeof APP_SCREEN.SETTINGS.HISTORY_TRANSACTION;
export const HistoryTransactionScreen = ({ navigation }: SettingScreenProps<ScreenHistoryTransaction>) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const dispatch = useAppDispatch();
	const walletLedger = useAppSelector((state) => selectWalletLedger(state));
	const { nextCursor, prevCursor } = useAppSelector((state) => selectWalletLedgerCursors(state));

	useEffect(() => {
		dispatch(fetchListWalletLedger({ cursor: undefined }));
	}, [dispatch]);

	const handleNextPage = () => {
		if (nextCursor) {
			dispatch(fetchListWalletLedger({ cursor: nextCursor }));
		}
	};

	const handlePrevPage = () => {
		if (prevCursor) {
			dispatch(fetchListWalletLedger({ cursor: prevCursor }));
		}
	};

	const valueText = (value: number) => {
		if (value > 0) return `+${formatNumber(value, 'vi-VN', 'VND')}`;
		else return `${formatNumber(value, 'vi-VN', 'VND')}`;
	};

	const renderItem = ({ item }: { item: ApiWalletLedger }) => {
		return (
			<Pressable key={`token_receiver_${item.id}`} style={styles.userItem}>
				<View>
					<Text style={styles.title}>{moment(item?.create_time).format('DD/MM/YYYY')}</Text>
					<Text style={styles.code}>Transaction code: {item?.transaction_id}</Text>
				</View>
				<Text style={[styles.title, { color: item?.value > 0 ? baseColor.bgSuccess : baseColor.buzzRed }]}>{valueText(item.value)}</Text>
			</Pressable>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<FlashList data={walletLedger} renderItem={renderItem} ItemSeparatorComponent={SeparatorWithLine} estimatedItemSize={size.s_50} />
			<View style={styles.cursor}>
				<TouchableOpacity
					style={[styles.cursorItem, { backgroundColor: !prevCursor ? themeValue.borderHighlight : themeValue.borderDim }]}
					disabled={!prevCursor}
					onPress={handlePrevPage}
				>
					<Text style={styles.title}>Previous page</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.cursorItem, { backgroundColor: !nextCursor ? themeValue.borderHighlight : themeValue.borderDim }]}
					disabled={!nextCursor}
					onPress={handleNextPage}
				>
					<Text style={styles.title}>Next page</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};
