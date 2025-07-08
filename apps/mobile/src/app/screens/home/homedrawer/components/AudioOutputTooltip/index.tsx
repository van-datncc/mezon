import { size, useTheme } from '@mezon/mobile-ui';
import { useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import MezonIconCDN from '../../../../../componentUI/MezonIconCDN';
import { IconCDN } from '../../../../../constants/icon_cdn';
import AudioOutputOptions from '../AudioOutputOptions';
import { style } from './styles';

// Audio output types
type AudioOutput = {
	id: string;
	name: string;
	type: 'speaker' | 'earpiece' | 'bluetooth' | 'headphones';
};

type IAudioOutputTooltipProps = {
	onOpenTooltip?: () => void;
	onSelectOutput?: (outputType: string) => void;
	availableOutputs: AudioOutput[];
	currentOutput: string;
};

const AudioOutputTooltip = ({ onOpenTooltip, onSelectOutput, availableOutputs, currentOutput }: IAudioOutputTooltipProps) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const [isShowTooltip, setIsShowTooltip] = useState(false);

	const toggleTooltip = () => {
		setIsShowTooltip(!isShowTooltip);
		if (!isShowTooltip) {
			onOpenTooltip();
		}
	};

	const onSelectOutputTooltip = useCallback(
		(outputType: string) => {
			onSelectOutput?.(outputType);
			setIsShowTooltip(false);
		},
		[onSelectOutput]
	);

	// Get appropriate icon based on current output
	const getAudioIcon = () => {
		switch (currentOutput) {
			case 'bluetooth':
				return IconCDN.bluetoothIcon;
			case 'speaker':
				return IconCDN.channelVoice;
			case 'headphones':
				return IconCDN.voiceLowIcon;
			case 'earpiece':
			default:
				return IconCDN.voiceLowIcon;
		}
	};

	const getIconSize = () => {
		return { height: size.s_20, width: size.s_20 };
	};

	return (
		<View style={styles.tooltipButton}>
			<View style={styles.toolTipContainer}>
				<Tooltip
					isVisible={isShowTooltip}
					content={
						<AudioOutputOptions
							onSelectOutput={onSelectOutputTooltip}
							availableOutputs={availableOutputs}
							currentOutput={currentOutput}
						/>
					}
					contentStyle={styles.toolTip}
					arrowSize={{ width: 0, height: 0 }}
					placement="center"
					onClose={() => setIsShowTooltip(false)}
					closeOnBackgroundInteraction={true}
					disableShadow={true}
					closeOnContentInteraction={true}
				>
					{!isShowTooltip && (
						<TouchableOpacity onPress={toggleTooltip} style={[styles.iconTooltip]}>
							<MezonIconCDN icon={getAudioIcon()} {...getIconSize()} color={themeValue.white} />
						</TouchableOpacity>
					)}
				</Tooltip>
			</View>
		</View>
	);
};

export default AudioOutputTooltip;
