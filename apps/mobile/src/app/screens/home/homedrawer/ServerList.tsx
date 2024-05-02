import React from "react";
import { View } from "react-native";
import { ServerIcon } from "./Reusables";
import LogoMezon from '../../../../assets/svg/logoMezon.svg';
import PlusGreenIcon from '../../../../assets/svg/guildAddCategoryChannel.svg';
import DiscoveryIcon from '../../../../assets/svg/discoveryStudentHubs.svg';

const ServerList = React.memo((props: any) => {
    // FAKE data
    const serverData = [
        {
          "id": 1,
          "image": "https://bom.so/jj1y8B",
          "title": "Space Explore",
          "channels": [
            {
              "id": 1,
              "category": "information",
              "items": [
                {
                  "id": 1,
                  "title": "welcome-and-rules",
                  "type": "text"
                },
                {
                  "id": 2,
                  "title": "notes-resources",
                  "type": "text"
                }
              ]
            },
            {
              "id": 2,
              "category": "text channels",
              "items": [
                {
                  "id": 3,
                  "title": "general",
                  "type": "text"
                },
                {
                  "id": 4,
                  "title": "casual-chat",
                  "type": "text"
                },
                {
                  "id": 5,
                  "title": "session-planning",
                  "type": "text"
                },
                {
                  "id": 6,
                  "title": "off-topic",
                  "type": "text"
                }
              ]
            },
            {
              "id": 3,
              "category": "video channels",
              "items": [
                {
                  "id": 7,
                  "title": "video-chat",
                  "type": "text"
                },
                {
                  "id": 8,
                  "title": "lounge",
                  "type": "voice"
                },
                {
                  "id": 9,
                  "title": "study room 1",
                  "type": "voice"
                },
                {
                  "id": 10,
                  "title": "study room 2",
                  "type": "voice"
                }
              ]
            }
          ]
        }
      ]
    ;
    return (
        <View style={{height: '100%', paddingTop: 20, width: '22%', justifyContent: 'flex-start'}}>
            <ServerIcon
                icon={<LogoMezon width={40} height={40} />}
                data={serverData[0]}
             />
            <View style={{width: '100%', alignItems: 'center', marginBottom: 10}}>
                <View style={{borderWidth: .5, borderColor: 'lightgray', width: '50%'}} />
            </View>
            {
                serverData.map(server =>
                    <ServerIcon data={server} />
                )
            }
            <ServerIcon icon={<PlusGreenIcon width={30} height={30} />} data={{}} />
            <ServerIcon icon={<DiscoveryIcon width={30} height={30} />} data={{}} />
        </View>
    )
})

export default ServerList;
