import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Banner from "./components/Banner";

export default function UserProfile() {
    return (
        <ScrollView contentContainerStyle={{ flex: 1 }}>
            <Banner />
        </ScrollView>
    )
}