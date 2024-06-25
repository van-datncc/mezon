import { IChannel } from "@mezon/utils";
import DMListItem from "./DMListItem";

type ListDMChannelProps = {
    listDM: IChannel[];
}

const ListDMChannel = (props: ListDMChannelProps) => {
    const {listDM} = props;
    return(
        listDM.map((directMessage: IChannel, index: number) => {
            return <DMListItem
                key={index}
                directMessage={directMessage}
            />;
        })
    );
}

export default ListDMChannel;