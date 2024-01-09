import { PreloadedRootState } from "@mezon/store";

const preloadedState: PreloadedRootState = {
    app: {
      theme: 'light',
      loadingStatus: 'loaded', 
    },
    auth: {
      loadingStatus: 'loaded',
    },
    clans: {
      loadingStatus: 'loaded',
      entities: {
        'clan1': {
          id: 'clan1',
          name: 'Mezon',
          description: 'Clan 1 description',
          image: 'https://avatars.githubusercontent.com/u/57796807?s=280&v=4',
          channelIds: ['channel1'],
          memberIds: ['user1'],
          categories: [{
            id: 'category1',
            name: 'General',
            channelIds: ['channel1'],
            clanId: 'clan1',
          }, {
            id: 'category2',
            name: 'Development',
            channelIds: ['channel2', 'channel3'],
            clanId: 'clan1',
          }],
          categoryIds: ['category1', 'category2'],
        }
      },
      ids: ['clan1'],
    },
    channels: {
      loadingStatus: 'loaded',
      entities: {
        'channel1': {
          id: 'channel1',
          name: 'Mezon',
          clanId: 'clan1',
          categoryId: 'category1',
          description: 'Channel 1 description',
          unread: false,
          memberIds: [],
          threadIds: [],
        },
        'channel2': {
          id: 'channel2',
          name: 'Process',
          clanId: 'clan1',
          categoryId: 'category2',
          description: 'Channel 2 description',
          unread: false,
          memberIds: [],
          threadIds: [],
        },
        'channel3': {
          id: 'channel3',
          name: 'Questions',
          clanId: 'clan1',
          categoryId: 'category2',
          description: 'Channel 3 description',
          unread: false,
          memberIds: [],
          threadIds: [],
        }   
      },
      ids: ['channel1', 'channel2', 'channel3'],
    },
    threads: {
      loadingStatus: 'loaded',
      entities: {},
      ids: [],
    },
    messages: {
      loadingStatus: 'loaded',
      entities: {
        '1': {
          id: '1',
          content: 'Welcome to Mezon',
          channelId: 'channel1',
          clanId: 'clan1',
          date: new Date().toLocaleString(),
          name: 'User 1',
          user: {
            id: 'user1',
            name: 'User 1',
            avatarSm: 'https://static.vecteezy.com/system/resources/previews/013/042/571/original/default-avatar-profile-icon-social-media-user-photo-in-flat-style-vector.jpg',
            username: 'user1',
          }
        },
        '2': {
          id: '2',
          content: 'Hi guys, I am new here',
          channelId: 'channel1',
          clanId: 'clan1',
          date: new Date().toLocaleString(),
          name: 'User 2',
          user: {
            id: 'user2',
            name: 'User 2',
            avatarSm: 'https://static.vecteezy.com/system/resources/previews/013/042/571/original/default-avatar-profile-icon-social-media-user-photo-in-flat-style-vector.jpg',
            username: 'user2',
          }
        },
        '3': {
          id: '3',
          content: 'Let\'s talk about Mezon',
          channelId: 'channel1',
          clanId: 'clan1',
          date: new Date().toLocaleString(),
          name: 'User 3',
          isMe: true,
          user: {
            id: 'user3',
            name: 'User 3',
            avatarSm: 'https://static.vecteezy.com/system/resources/previews/013/042/571/original/default-avatar-profile-icon-social-media-user-photo-in-flat-style-vector.jpg',
            username: 'user3',
          }
        },
        '4': {
          id: '4',
          content: 'Anybody here?',
          channelId: 'channel2',
          clanId: 'clan1',
          date: new Date().toLocaleString(),
          name: 'User 4',
          user: {
            id: 'user4',
            name: 'User 4',
            avatarSm: 'https://static.vecteezy.com/system/resources/previews/013/042/571/original/default-avatar-profile-icon-social-media-user-photo-in-flat-style-vector.jpg',
            username: 'user4',
          }
        },
        '5': {
          id: '5',
          content: 'Everybody is sleeping',
          channelId: 'channel3',
          clanId: 'clan1',
          date: new Date().toLocaleString(),
          name: 'User 5',
          user: {
            id: 'user5',
            name: 'User 5',
            avatarSm: 'https://static.vecteezy.com/system/resources/previews/013/042/571/original/default-avatar-profile-icon-social-media-user-photo-in-flat-style-vector.jpg',
            username: 'user5',
          }
        },
      },
      ids: ['1', '2', '3'],
    },
    users: {
      loadingStatus: 'loaded',
      entities: {},
      ids: [],
    },
  }

  export { preloadedState }