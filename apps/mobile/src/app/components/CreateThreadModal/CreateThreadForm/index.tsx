import React from 'react'
import { View , Text, TextInput, SafeAreaView, Switch, Button} from 'react-native'
import { styles } from './CreateThreadForm.style';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import { createNewChannel, selectCurrentChannel, selectCurrentChannelId } from 'libs/store/src/lib/channels/channels.slice';
import { ApiCreateChannelDescRequest } from 'mezon-js/api.gen';
import { selectCurrentClanId, useAppDispatch } from '@mezon/store-mobile';
import { ChannelType } from 'mezon-js';
import ThreadIcon from '../../../../assets/svg/thread.svg'


export default function CreateThreadForm() {
  const dispatch = useAppDispatch();
  const currentClanId = useSelector(selectCurrentClanId);
  const currentChannel = useSelector(selectCurrentChannel);
  const currentChannelId = useSelector(selectCurrentChannelId);
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
       await dispatch(createNewChannel(body));
    } catch (error) {}

   }

 }

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
          thumbColor={values.isPrivateThread ? 'white' : 'white'}
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
