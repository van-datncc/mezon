export const CreateChannelButton = () => {
    const handleCreate = () => {
        console.log("clicked Create")
    }


  return (
    <div className="Frame394 relative border-black self-stretch px-5 pt-5 pb-8 bg-neutral-900 border-t justify-end items-center gap-3 inline-flex">
      <div className="Button flex-col justify-center items-center inline-flex">
        <div className="ButtonMaster1 w-[85px] flex-col justify-center items-center gap-2 flex">
          <div className="Button self-stretch grow shrink basis-0 px-4 py-3 rounded flex-col justify-center items-center flex">
            <div className="Content justify-start items-center gap-2 inline-flex">
              <button className="Text text-blue-300 text-base font-medium font-['Manrope'] leading-normal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="Button flex-col justify-center items-center inline-flex">
        <div className="ButtonMaster1 w-[150px] flex-col justify-center items-center gap-2 flex">
          <div className="Button self-stretch grow shrink basis-0 px-4 py-3  bg-blue-600 rounded flex-col justify-center items-center flex">
            <div className="Content justify-start items-center gap-2 inline-flex">
              <button onClick={handleCreate} className="Text text-white text-base font-medium font-['Manrope'] leading-normal">
                Create Channel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
