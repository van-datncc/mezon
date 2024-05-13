import React from 'react'
import { View , Text, TextInput, SafeAreaView, Switch, Button} from 'react-native'
import { styles } from './CreateThreadForm.style';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import { createNewChannel, selectCurrentChannel, selectCurrentChannelId, channelsActions, messagesActions } from '@mezon/store-mobile';
import { ApiCreateChannelDescRequest } from 'mezon-js/api.gen';
import { getStoreAsync, selectCurrentClanId, useAppDispatch } from '@mezon/store-mobile';
import { ChannelType } from 'mezon-js';
import ThreadIcon from '../../../../assets/svg/thread.svg'
import { IChannel } from '@mezon/utils';
import { APP_SCREEN } from '../../../navigation/ScreenTypes';
import { useNavigation } from '@react-navigation/native';


export default function CreateThreadForm() {
  const dispatch = useAppDispatch();
  const currentClanId = useSelector(selectCurrentClanId);
  const currentChannel = useSelector(selectCurrentChannel);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const navigation = useNavigation();
 const handleCreateThreads = async (value) =>{
  const body: ApiCreateChannelDescRequest = {
    clan_id: currentClanId?.toString(),
    channel_label: value.threadName,
    channel_private: value.isPrivateThread ? 1 : 0,
    parrent_id: currentChannelId as string,
    category_id: currentChannel?.category_id,
    type: ChannelType.CHANNEL_TYPE_TEXT,
  };
   if(value?.threadName) {
    try {
     const newThreadResponse =  await dispatch(createNewChannel(body));
     handleRouteData(newThreadResponse.payload as IChannel)
    } catch (error) {}
   }
 }

 const handleRouteData = async (thread?: IChannel) => {
  const store = await getStoreAsync();
  navigation.navigate(APP_SCREEN.HOME);
  const channelId =  thread?.channel_id ;
  const clanId = thread?.clan_id
  store.dispatch(messagesActions.jumpToMessage({ messageId: '', channelId: channelId }));
  store.dispatch(channelsActions.joinChannel({ clanId: clanId ?? '', channelId: channelId, noFetchMembers: false }));
};

  return (
    <View style={styles.createChannelContainer}>
      <Formik
     initialValues={{ threadName: null, isPrivateThread: false }}
     onSubmit={handleCreateThreads}
   >
    {
      ({ setFieldValue, handleChange, handleBlur, handleSubmit, values })=>(
        <View style={styles.createChannelContent}>
            <View style={styles.iconContainer}>
              <ThreadIcon width={22} height={22}/>
            </View>
        <Text style={styles.threadName}>Thread Name</Text>
        <SafeAreaView>
        <TextInput
         autoFocus={true}
         onChangeText={handleChange('threadName')}
         onBlur={handleBlur('threadName')}
         value={values.threadName}
          placeholderTextColor='#7e848c'
          placeholder='New Thread'
          style={styles.inputThreadName}
        />
      </SafeAreaView>
      <View style={styles.threadPolicy}>
         <View style={styles.threadPolicyInfo}>
         <Text style={styles.threadPolicyTitle}>Private Thread</Text>
         <Text style={styles.threadPolicyContent}>Only people you invite and moderators can see this thread</Text>
         </View>
        <Switch
         value={values.isPrivateThread}
         trackColor={{false: '#676b73', true: '#5a62f4'}}
          thumbColor={'white'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={value =>{
            setFieldValue('isPrivateThread', value)
          }}
        />
      </View>
      <Button onPress={() => handleSubmit()} title="Send message" />
      </View>
      )
    }
   </Formik>
    </View>
  )
}
