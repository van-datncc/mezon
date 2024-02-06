import { Image } from '@mezon/ui';
import { useChat, useAppNavigation, useChatDirect } from '@mezon/core';
import { MainContent } from './MainContent';
import IconLogoMezon from '../../../assets/Images/IconLogoMezon.svg';
import IconCreateClan from '../../../assets/Images/IconCreateClan.svg';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ModalCreateClan, ModalListClans, NavLinkComponent } from '@mezon/components';

function MyApp() {
  const { clans, currentClan } = useChat();
  const [openListClans, setOpenListClans] = useState(false);
  const [openCreateClan, setOpenCreateClans] = useState(false)
  const { navigate, toClanPage } = useAppNavigation();
  const pathName = useLocation().pathname;

  const handleChangeClan = (clanId: string) => {
    navigate(toClanPage(clanId));
  }
  const handleOpenCreate = () => {
    setOpenCreateClans(true)
  }

  const { friends } = useChatDirect(undefined);
  const quantityPendingRequest = friends.filter((obj) =>
    obj.state === 2
  ).length || 0

  return (
    <div className="flex h-screen text-gray-100">
      <div className="hidden overflow-visible py-4 px-3 space-y-2 bg-bgPrimary md:block scrollbar-hide">
        <NavLink to="/chat/direct/friends">
          <NavLinkComponent active={pathName.includes('direct')}>
            <div >
              <Image src={IconLogoMezon} alt={'logoMezon'} width={48} height={48} />
              {quantityPendingRequest !== 0 && (
                <div className="absolute w-[20px] h-[20px] rounded-full bg-colorDanger text-[#fff] font-bold text-[10px] flex items-center justify-center top-7 right-[0]">
                  {quantityPendingRequest}
                </div>
              )}
            </div>
          </NavLinkComponent>
        </NavLink>
        <div className="py-2 border-t-2 border-t-borderDefault"></div>
        {currentClan?.id && (<NavLink to={`/chat/servers/${currentClan.id}`}>
          <NavLinkComponent active={!pathName.includes('direct')}>
            {currentClan?.logo ? (
              <Image
                src={currentClan?.logo || ''}
                alt={currentClan?.clan_name || ''}
                placeholder="blur"
                width={48}
                style={{ borderRadius: '50%' }}
                blurDataURL={currentClan?.logo}
              />
            ) : (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <>
                {currentClan?.clan_name && (
                  <div className='w-[48px] h-[48px] bg-bgTertiary rounded-full flex justify-center items-center text-contentSecondary text-[20px]'>
                    {currentClan.clan_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </>
            )}
          </NavLinkComponent>
        </NavLink>
        )}

        <div className="relative py-2" onClick={() => { setOpenListClans(!openListClans) }}>
          <Image src={IconCreateClan} alt={'logoMezon'} width={48} height={48} />
          <div className='absolute bottom-0 right-0 top-0 left-[60px] z-10 bg-bgSecondary'>
            <ModalListClans
              options={clans}
              showModal={openListClans}
              idSelectedClan={currentClan?.clan_id}
              onChangeClan={handleChangeClan}
              createClan={handleOpenCreate}
              onClose={() => setOpenListClans(false)}
            />
          </div>
        </div>
      </div>
      <MainContent />
      <ModalCreateClan open={openCreateClan} onClose={() => { setOpenCreateClans(false) }} />
    </div>
  );
}

export default MyApp;
