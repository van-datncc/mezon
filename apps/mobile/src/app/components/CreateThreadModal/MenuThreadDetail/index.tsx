import React from 'react'
import { View , Text, Pressable} from 'react-native'
import { styles } from './MenuThreadDetail.styles';
import { selectCurrentChannel } from '@mezon/store';
import { useSelector } from 'react-redux';
import HashSignIcon from '../../../../assets/svg/channelText-white.svg';
import SearchLogo from '../../../../assets/svg/discoverySearch-white.svg';
import ThreadIcon from '../../../../assets/svg/thread.svg';
import MuteIcon from '../../../../assets/svg/mute.svg';
import SettingIcon from '../../../../assets/svg/setting.svg';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import { useNavigation } from '@react-navigation/native';

export default function MenuThreadDetail() {
  const navigation = useNavigation()
  const currentChannel = useSelector(selectCurrentChannel);
  const threadOption = [
    {
      id: 1,
      title: 'Search',
      action: ()=>{},
      icon: <SearchLogo width={22} height={22}/>
    },
    {
      id: 2,
      title: 'Threads',
      action: ()=>{
        navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, { screen: APP_SCREEN.MENU_THREAD.CREATE_THREAD});
      },
      icon: <ThreadIcon width={22} height={22}/>
    },
    {
      id: 3,
      title: 'Mute',
      action: ()=>{},
      icon: <MuteIcon width={22} height={22}/>
    },
    {
      id: 4,
      title: 'Settings',
      action: ()=>{},
      icon: <SettingIcon width={22} height={22}/>
    },
  ]

  return (
     <View style={styles.bottomSheetContainer}>
    <View style={styles.bottomSheetContent}>
      {!!currentChannel?.channel_label && <HashSignIcon width={18} height={18} />}
      <Text style={styles.channelLabel}>{currentChannel?.channel_label}</Text>
    </View>
    <View style={styles.iconContainer}>
        {
          threadOption.map(option => (
            <Pressable onPress={option.action}>
               <View key={option.id} style={styles.settingOptions}>
                  <View style={styles.settingOptionsIcon}>
                   {option.icon}
                </View>
                <Text  style={styles.optionText}>{option.title}</Text>
                </View>
            </Pressable>
          ))
        }
    </View>
    </View>
  )
}
