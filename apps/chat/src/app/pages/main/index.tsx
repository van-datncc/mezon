import { Image } from '@mezon/ui';
import { useChat } from '@mezon/core';
import { ModalListClans, NavLink } from '@mezon/components';
import { MainContent } from './MainContent';
import IconLogoMezon from '../../../assets/Images/IconLogoMezon.svg';
import IconListClans from '../../../assets/Images/IconListClans.svg';
import IconCreateClan from '../../../assets/Images/IconCreateClan.svg';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function MyApp() {
  const { clans, currentClan, changeCurrentClan, currentChanel } = useChat();
  const [openListClans, setOpenListClans] = useState(false);
  const navigate = useNavigate();
  const pathName = useLocation().pathname;
  const channelSlug = currentChanel ? `/channels/${currentChanel.id}` : '';
  const url = `/chat/servers/${currentClan?.id}${channelSlug}`;

  const handleChangeClan = (clanId: string) => {
    changeCurrentClan(clanId)
    navigate(`/chat/servers/${clanId}${channelSlug}`);
  }

  return (
    <div className="flex h-screen text-gray-100">
      <div className="hidden overflow-visible py-4 px-3 space-y-2 bg-bgPrimary md:block scrollbar-hide">
        <NavLink href="/mezon/direct/12" active={pathName?.includes('direct')}>
          <Image src={IconLogoMezon} alt={'logoMezon'} />
        </NavLink>
        <div className="py-2 border-t-2 border-t-borderDefault"></div>

        <NavLink
          href={`${url}`}
          active={!pathName?.includes('direct')}
          key={currentClan?.id}
        >
          <>
            <Image
              src={currentClan?.image || ''}
              alt={currentClan?.name || ''}
              placeholder="blur"
              width={48}
              style={{ borderRadius: '50%' }}
              blurDataURL={currentClan?.image}
            />
          </>
        </NavLink>

        <div className="relative py-2" onClick={() => setOpenListClans(!openListClans)}>
          <Image src={IconListClans} alt={'logoMezon'} width={48} height={48} />
          <div className='absolute bottom-0 right-0 top-0 left-[54px] z-10 bg-bgSecondary'>
            <ModalListClans
              options={clans}
              showModal={openListClans}
              idSelectedClan={currentClan?.id}
              onChangeClan={handleChangeClan}
            />
          </div>
        </div>

        <div className="relative" onClick={() => { console.log('Create Clan') }}>
          <Image src={IconCreateClan} alt={'logoMezon'} width={48} height={48} />
        </div>
      </div>
      <MainContent />
    </div>
  );
}

export default MyApp;
