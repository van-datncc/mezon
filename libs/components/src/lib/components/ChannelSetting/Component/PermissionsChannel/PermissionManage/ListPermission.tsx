import { selectAllPermissionsDefault } from "@mezon/store";
import { Icons } from "@mezon/ui";
import { useSelector } from "react-redux";

const ListPermission = () => {
    const listPermission = useSelector(selectAllPermissionsDefault);
    return(
        <div className="basis-2/3">
            <h4 className="uppercase font-bold text-xs text-contentTertiary mb-2">General Channel Permissions</h4>
            <div className="space-y-2">
                {listPermission.map(item => 
                    <ItemPermission 
                        key={item.id}
                        id={item.id}
                        title={item.title}
                    />
                )}
            </div>
        </div>
    )
}

export default ListPermission;

type ItemPermissionProps = {
    id?: string;
    title?: string;
}

const ItemPermission = (props: ItemPermissionProps) => {
    const {id, title} = props;
    return(
        <div className="flex justify-between items-center">
            <p>{title}</p>
            <div className="h-[26px] flex rounded-md overflow-hidden border dark:border-gray-700">
                <button className="w-8 flex justify-center items-center">
                    <Icons.Close defaultSize='size-4'/>
                </button>
                <button className="w-8 flex justify-center items-center">
                    <Icons.IconOr defaultSize='size-4'/>
                </button>
                <button className="w-8 flex justify-center items-center">
                    <Icons.IconTick defaultSize='size-4'/>
                </button>
            </div>
        </div>
    )
}