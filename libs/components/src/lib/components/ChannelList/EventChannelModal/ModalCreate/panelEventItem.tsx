import { useEventManagement } from '@mezon/core';
import { Coords } from '../../../ChannelLink';
import ItemPanel from '../../../PanelChannel/ItemPanel';
import { EventManagementEntity } from '@mezon/store';

type PanelEventItemProps = {
    coords: Coords;
    checkUserCreate: boolean;
    event: EventManagementEntity | undefined;
    onHandle: (e: any) => void;
    onClose: () => void;
}

function PanelEventItem(props: PanelEventItemProps) {
    const { coords, checkUserCreate, event, onHandle, onClose } = props;
    const { deleteEventManagement } = useEventManagement();

    const handleDeleteEvent = async () =>{
        await deleteEventManagement(event?.clan_id || '', event?.id || '');
        onClose();
    }

    return(
        <div 
            className="fixed dark:bg-bgProfileBody bg-gray-100 rounded-sm shadow z-10 w-[200px] py-[10px] px-[10px]"
            style={{ left: coords.mouseX + 10, top: coords.distanceToBottom > 140 ? coords.mouseY - 30 : '', bottom: coords.distanceToBottom < 140 ? '20px' : ''}}
            onClick={onHandle}
        >
            {checkUserCreate && 
                <>
                    <ItemPanel children="Start Event" />
                    <ItemPanel children="Edit Event" />
                    <ItemPanel children="Cancel Event" onClick={handleDeleteEvent}/>
                </>
            }
            <ItemPanel children="Copy Event Link" />
        </div>
    );
}

export default PanelEventItem;