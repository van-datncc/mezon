import React from 'react'
import { View , Text, TouchableOpacity} from 'react-native'
import { styles } from './styles'
import {useNavigation} from '@react-navigation/native'
import { APP_SCREEN } from '../../navigation/ScreenTypes';
import { ThreadIcon } from '@mezon/mobile-components';

export default function CreateThreadModal() {
  const navigation = useNavigation();
  const handleNavigateCreateForm = () =>{
    navigation.navigate(APP_SCREEN.MENU_THREAD.STACK, { screen: APP_SCREEN.MENU_THREAD.CREATE_THREAD_FORM_MODAL});
  }
  return (
    <View style={styles.createChannelContainer}>
      <View style={styles.createChannelContent}>
        <View style={styles.iconContainer}><ThreadIcon width={22} height={22}/></View>
      <Text style={styles.textNoThread}>There are no threads</Text>
      <Text style={styles.textNotify}>Stay focus on conversation with a threads - a temporary text channel.</Text>
      <TouchableOpacity onPress={handleNavigateCreateForm} style={[styles.button]}>
      <Text style={[styles.buttonText]}>Create Threads</Text>
    </TouchableOpacity>
      </View>
    </View>
  )
}



