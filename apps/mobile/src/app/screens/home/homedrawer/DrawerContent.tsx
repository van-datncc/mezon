import React from "react";
import { View } from "react-native";
import ServerList from "./ServerList";
import ChannelList from "./ChannelList";

const DrawerContent = React.memo((props: any) => {

    return (
        <View {...props.dProps} style={{flex: 1, flexDirection: 'row', backgroundColor: '#2b2d31' }}>
            <ServerList />
            <ChannelList navigation={props.dProps.navigation} />
        </View>
    )
})

export default DrawerContent;
