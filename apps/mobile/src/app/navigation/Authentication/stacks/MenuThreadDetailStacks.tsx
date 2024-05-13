import { CardStyleInterpolators, TransitionSpecs, createStackNavigator } from "@react-navigation/stack";
import { APP_SCREEN } from "../../ScreenTypes";
import { Text } from "react-native";
import { useSelector } from "react-redux";
import { selectCurrentChannel } from "libs/store/src/lib/channels/channels.slice";
import CreateThreadModal from "../../../components/CreateThreadModal";
import ThreadAddButton from "../../../components/CreateThreadModal/ThreadAddButton";
import CreateThreadForm from "../../../components/CreateThreadModal/CreateThreadForm";
import SearchLogo from '../../../../assets/svg/discoverySearch-white.svg';
import MenuThreadDetail from "../../../components/CreateThreadModal/MenuThreadDetail";

export const MenuThreadDetailStacks = ({} : any) =>{
  const Stack = createStackNavigator();
  const currentChannel = useSelector(selectCurrentChannel);
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
				headerShadowVisible: false,
				gestureEnabled: true,
				gestureDirection: 'horizontal',
				transitionSpec: {
					open: TransitionSpecs.TransitionIOSSpec,
					close: TransitionSpecs.TransitionIOSSpec,
				},
				cardStyle: { backgroundColor: '#2b2d31' },
				cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
			}}
			>
      <Stack.Screen
				name={APP_SCREEN.MENU_THREAD.BOTTOM_SHEET}
				component={MenuThreadDetail}
				options={{
					headerShown: false,}}
			/>
			<Stack.Screen
				name={APP_SCREEN.MENU_THREAD.CREATE_THREAD}
				component={CreateThreadModal}
				options={{
					headerShown: true,
          headerTitle: 'Threads',
          headerTitleStyle: {
            color: 'white',
          },
          headerStyle: {
            backgroundColor: '#1e1f22',
          },
          headerTintColor: '#ffffff',
          headerRight: () => (
            <ThreadAddButton />
          ),
				}}
			/>
      	<Stack.Screen
				name={APP_SCREEN.MENU_THREAD.CREATE_THREAD_FORM_MODAL}
				component={CreateThreadForm}
				options={{
					headerShown: true,
          headerTitle: ()=> <Text style={{color: 'white'}}>{currentChannel.channel_label}</Text>,
          headerTitleStyle: {
            color: 'white',
          },
          headerStyle: {
            backgroundColor: '#1e1f22',
          },
          headerTintColor: '#ffffff',
          headerRight: () => (
            <SearchLogo width={22} height={22}/>
          ),
				}}
			/>
		</Stack.Navigator>
	);
}

