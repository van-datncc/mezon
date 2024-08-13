import { Icons } from "@mezon/ui";
import { memo, useState } from "react";

const PermissionManage = () => {
    const [showRole, setShowRole] = useState(false);
    return (
        <div>
            <HeaderPermissionManage showRole={showRole} setShowRole={setShowRole}/>
            {showRole && <MainPermissionManage />}
        </div>
    )
}

export default PermissionManage;

type PermissionManageProps = {
    showRole: boolean;
    setShowRole?: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderPermissionManage = memo(({showRole, setShowRole=()=>{}} : PermissionManageProps) => {
    return(
        <div className="flex items-center gap-x-3.5" onClick={()=>setShowRole(!showRole)}>
            <h3 className="text-xl font-semibold">Advanced permissions</h3>
            <Icons.ArrowDown defaultSize={`size-5 dark:text-white text-black transition-all duration-300 ${showRole ? '' : '-rotate-90'}`}/>
        </div>
    )
})

const MainPermissionManage = () => {
    return(
        <div className="flex">
            <div className="basis-1/3">test1</div>
            <div className="basis-2/3">tesst2</div>
        </div>
    )
}