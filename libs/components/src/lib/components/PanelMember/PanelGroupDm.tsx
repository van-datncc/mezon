import GroupPanelMember from "./GroupPanelMember";
import ItemPanelMember from "./ItemPanelMember";

const PanelGroupDM = () => {
    return(
        <>
            <GroupPanelMember>
                <ItemPanelMember children="Change Icon" />
                <ItemPanelMember children="Mute Conversation" />
            </GroupPanelMember>
            <ItemPanelMember children="Leave Group" danger/>
        </>
    );
}

export default PanelGroupDM;