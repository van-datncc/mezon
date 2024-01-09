

import { Image } from '@mezon/ui'
import { useChat } from '@mezon/core'
import { Discord, NavLink } from '@mezon/components'
import { IClan } from '@mezon/utils';
import { MainContent } from './MainContent';

function MyApp() {
  const { clans } = useChat();

  return (
      <div className="flex h-screen text-gray-100">
        <div className="hidden overflow-y-scroll p-3 space-y-2 bg-gray-900 md:block scrollbar-hide">
          <NavLink href="/">
            <Discord className="w-7 h-5" />
          </NavLink>

          <hr className="mx-2 rounded border-t-2 border-t-white/[.06]" />

          {clans.map((clan: IClan) => (
            <NavLink
              href={`/chat/servers/${clan.id}`}
              active={true}
              key={clan.id}
            >
              <Image
                src={clan.image}
                alt={clan.name}
                width={48}
                height={48}
                placeholder="blur"
                blurDataURL={clan.image}
              />
            </NavLink>
          ))}
        </div>
        <MainContent />
      </div>
  )
}

export default MyApp
