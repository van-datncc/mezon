import { useAppNavigation, useAppParams } from "@mezon/core";
import { selectDefaultChannelIdByClanId } from "@mezon/store";
import { useSelector } from "react-redux";

import 'react-loading-skeleton/dist/skeleton.css'
import { useEffect } from "react";

export function ClanIndex() {
    const { serverId } = useAppParams();
    const defaultChannelId = useSelector(selectDefaultChannelIdByClanId(serverId || ''))
    const { navigate } = useAppNavigation();

    useEffect(() => {
        if (defaultChannelId) {
            navigate(`./channels/${defaultChannelId}`)
        }
    }, [defaultChannelId, navigate])

    return (
        <div className="flex h-screen text-gray-100">
            <div className="hidden overflow-visible py-4 px-3 space-y-2 bg-bgPrimary md:block scrollbar-hide">
                {/* Placeholder for IconLogoMezon */}
                <div className="w-48 h-48"></div>
                <div className="py-2 border-t-2 border-t-borderDefault"></div>

                {/* Placeholder for currentClan */}
                <div>
                    <div className="w-48 h-48"></div>
                </div>

                <div className="relative py-2">
                    {/* Placeholder for IconCreateClan */}
                    <div className="w-48 h-48"></div>
                    <div className='absolute bottom-0 right-0 top-0 left-[60px] z-10'>
                        {/* Placeholder for ModalListClans */}
                        <div className="w-full h-full"></div>
                    </div>
                </div>
            </div>
            {/* Placeholder for MainContent */}
            <div className="flex-grow"></div>
        </div>

    )
}

