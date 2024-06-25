import { useMemo } from "react";
import { IMezonMenuSectionProps, MezonMenu, MezonRadioButton } from "../../temp-ui";
import { View } from "react-native";
import { useState } from "react";

interface IMezonOptionProps extends Omit<IMezonMenuSectionProps, "items"> {
    onChange?: (value: number | string) => void;
    data: {
        description?: string;
        title: string;
        value: number | string;
    }[],
    value?: number | string;
}

export default function MezonOption({ data, onChange, value, ...menuProps }: IMezonOptionProps) {
    const [currentValue, setCurrentValue] = useState<number | string>(value || data?.[0]?.value || 0);

    function handleChange(value: number | string) {
        setCurrentValue(value);
        onChange && onChange(value);
    }

    const menu = useMemo(() => ([
        {
            items: data.map((item) => ({
                ...item,
                component: (
                    <MezonRadioButton
                        checked={item.value === currentValue}
                        onChange={() => handleChange(item.value)}
                        noSwitchFalse
                    />
                ),
                onPress: () => handleChange(item.value)
            })),
            ...menuProps
        }
    ]) satisfies IMezonMenuSectionProps[], [data, currentValue]);

    return (
        <View>
            <MezonMenu menu={menu} />
        </View>
    )
}