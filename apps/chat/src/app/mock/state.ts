import { PreloadedRootState } from "@mezon/store";
import ClanImage1 from '../../assets/Images/ClanImage.png'
import ClanImage2 from '../../assets/Images/Clan2Image.png'

const preloadedState = {
    app: {
      theme: 'light',
      loadingStatus: 'loaded', 
    },
    account: {
      loadingStatus: 'loaded',
    },
    threads: {
      loadingStatus: 'loaded',
      entities: {},
      ids: [],
    },
    users: {
      loadingStatus: 'loaded',
      entities: {},
      ids: [],
    },
  } as unknown as PreloadedRootState;

  export { preloadedState }