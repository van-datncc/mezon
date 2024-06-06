import { useState } from "react";

enum tabs {
    event= 'Events',
    interest= 'Interested',
}

type DetailItemEventProps = {
    setOpenModalDetail: (status: boolean) => void,
}

const DetailItemEvent = (props: DetailItemEventProps) => {
    const { setOpenModalDetail } = props;
    const [currentTab, setCurrentTab] = useState('Events');

    return (
        <div className="relative w-full max-w-[600px]">
            <div className="rounded-lg overflow-hidden text-sm">
                <div className="dark:bg-[#313339] bg-white dark:text-white text-black flex justify-between items-center pt-4 border-b border-zinc-600">
                    <div className="flex items-center gap-x-4 ml-4">
                        <div className="gap-x-6 flex items-center">
                            <h4 className={`pb-4 ${currentTab === tabs.event ? 'text-white border-b border-white' : 'text-zinc-400'}`} onClick={() => setCurrentTab(tabs.event)}>Events</h4>
                            <h4 className={`pb-4 ${currentTab === tabs.interest ? 'text-white border-b border-white' : 'text-zinc-400'}`} onClick={() => setCurrentTab(tabs.interest)}>Interested</h4>
                        </div>
                    </div>
                    <span className="text-5xl leading-3 dark:hover:text-white hover:text-black mr-4" onClick={() => setOpenModalDetail(false)}>
                        ×
                    </span>
                </div>
            </div>
        </div>
    );
}

export default DetailItemEvent;