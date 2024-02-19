export type ModalExitProps = {
    onClose: () => void;
};
const ExitSetting = (props:ModalExitProps) => {
    const {onClose } = props
    const handleClose = () => {
        onClose()
    }
    return (
        
        <div className="bg-bgSecondary w-1/5">
            <div className="w-1/4 text-black ml-[40px] pt-[94px]">
                <button className="bg-white w-[30px] h-[30px] rounded-[50px] font-bold" onClick={handleClose}>X</button>
                <p className="text-white mt-[10px]" >ESC</p>
            </div>
        </div>
    )
  }
  
  export default ExitSetting;