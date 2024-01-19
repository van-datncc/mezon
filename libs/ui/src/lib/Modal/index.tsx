export type ModalProps = {
    children: React.ReactNode
    showModal: boolean;
    title: string;
    onClose: () => void;
    confirmButton: () => void;
    titleConfirm: string
};

const Modal = (props: ModalProps) => {
    const { showModal, onClose, confirmButton, title, children, titleConfirm } = props
    return (
        <>
            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="flex items-center justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                    <h3 className="text-[22px] font-semibold">
                                        {title}
                                    </h3>
                                    <button
                                        className="flex items-center justify-center opacity-50"
                                        onClick={onClose}
                                    >
                                        <span className="text-3xl">
                                            ×
                                        </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="relative px-6 py-4 flex-auto">
                                    {children}
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                    <button
                                        className="text-black-500 background-transparent font-semibold px-4 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-primary text-white active:bg-emerald-600 font-semibold text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        onClick={() => { confirmButton(), onClose() }}
                                    >
                                        {titleConfirm}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    );
}

export default Modal