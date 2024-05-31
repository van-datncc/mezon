import { Text, TextInput, View } from "react-native";
import styles from "./styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CloseIcon, CrossIcon } from "@mezon/mobile-components";

interface IMezonInputProps {
    placeHolder?: string;
    label?: string;
    textarea?: boolean;
}

export default function MezonInput({ placeHolder, label, textarea }: IMezonInputProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputBox}>
                <TextInput
                    multiline={textarea}
                    numberOfLines={textarea ? 4 : 1}
                    style={styles.input}
                    placeholder={placeHolder}
                    placeholderTextColor="gray"
                />

                {!textarea &&
                    <TouchableOpacity style={styles.clearBtn}>
                        <CloseIcon height={10} width={10} color="black" />
                    </TouchableOpacity>
                }
            </View>
        </View>

    )
}