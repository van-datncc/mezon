import { useTheme } from '@mezon/mobile-ui';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MezonRadioButton } from '../../../temp-ui';
import { ENotificationType } from '../../NotificationSetting';
import { style } from '../NotificationSetting.styles';

interface FilterCheckboxProps {
	id: number;
	isChecked: boolean;
	label: string;
	defaultNotifyName: string;
	onCheckboxPress: (checked: boolean, id: number) => void;
}

const FilterCheckbox: React.FC<FilterCheckboxProps> = React.memo(({ id, isChecked, label, defaultNotifyName, onCheckboxPress }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const handleCheckboxPress = () => {
		onCheckboxPress(!isChecked, id);
	};
	return (
		<TouchableOpacity onPress={handleCheckboxPress} style={styles.option}>
			<View>
				<Text style={styles.labelOption}>{label}</Text>
				{[ENotificationType.CATEGORY_DEFAULT].includes(label as ENotificationType) && (
					<Text style={styles.defaultNotifyName}>
						{defaultNotifyName?.charAt(0)?.toUpperCase() + defaultNotifyName?.slice(1)?.toLowerCase()}
					</Text>
				)}
			</View>

			<MezonRadioButton checked={isChecked} />
		</TouchableOpacity>
	);
});

export default FilterCheckbox;
