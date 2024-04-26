import React from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Dots from '../../../../assets/svg/guildMoreOptions1.svg'
import { ChannelListSection, ChannelListContext } from "./Reusables";

const ChannelList = React.memo((props: any) => {
    const channelData = {"id":1,"image":"https://img.freepik.com/free-photo/glowing-spaceship-orbits-planet-starry-galaxy-generated-by-ai_188544-9655.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1713139200&semt=sph","title":"Space Explore","channels":[{"id":1,"category":"information","items":[{"id":1,"title":"welcome-and-rules","type":"text"},{"id":2,"title":"notes-resources","type":"text"}]},{"id":2,"category":"text channels","items":[{"id":3,"title":"general","type":"text"},{"id":4,"title":"casual-chat","type":"text"},{"id":5,"title":"session-planning","type":"text"},{"id":6,"title":"off-topic","type":"text"}]},{"id":3,"category":"video channels","items":[{"id":7,"title":"video-chat","type":"text"},{"id":8,"title":"lounge","type":"voice"},{"id":9,"title":"study room 1","type":"voice"},{"id":10,"title":"study room 2","type":"voice"}]}]};

    return (
        <ChannelListContext.Provider value={{navigation: props.navigation}}>
            <View style={[styles.mainList, {backgroundColor: '#232323',}]}>
                <ServerListHeader title={'KOMU'} />
                <FlatList
                    data={[{}]}
                    renderItem={({ item }) => <>
                        {
                            channelData.channels?.map(channel =>
                                <ChannelListSection data={channel} />
                            )
                        }
                    </>}
                />
                
            </View>
        </ChannelListContext.Provider>
    )
});

const ServerListHeader = React.memo((props: {title: string}) => {

    return (
        <TouchableOpacity style={styles.listHeader}>
            <Text style={{color: '#FFF', fontWeight: 'bold', fontSize: 18}}>{props.title}</Text>
            <Dots width={30} height={30} />
        </TouchableOpacity>
    )
});

const styles = StyleSheet.create({
    mainList: {
        height: '100%',
        width: '78%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden'
    },
    listHeader: {
        width: '100%',
        height: 50,
        borderTopLeftRadius: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopRightRadius: 10,
        marginBottom: 10
    }
})

export default ChannelList;
