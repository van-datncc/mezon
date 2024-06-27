import { Colors } from '@mezon/mobile-ui';
import { Slider } from '@miblanchard/react-native-slider';
import styles from './styles';
import { Text, View } from 'react-native';
import { useState } from 'react';

interface IMezonSliderProps {
    title: string;
    minimumValue: number;
    maximumValue: number;
    smoothAnimation?: boolean;
}

export default function MezonSlider({ title, maximumValue, minimumValue, smoothAnimation }: IMezonSliderProps) {
    const [value, setValue] = useState<number>(minimumValue);

    function handleValueChange(arr: Array<number>, index: number) {
        setValue(arr[index]);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
            <Slider
                animateTransitions={true}
                minimumValue={maximumValue}
                maximumValue={minimumValue}
                value={value}
                step={smoothAnimation ? 0 : 1}
                onValueChange={handleValueChange}
                thumbStyle={styles.thumb}
                trackStyle={styles.track}
                minimumTrackStyle={styles.miniTrack}
            />
        </View>
    )
}