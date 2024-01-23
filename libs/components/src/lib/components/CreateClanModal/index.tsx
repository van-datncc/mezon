import { InputField, Modal } from "@mezon/ui";
import { useState } from "react";
import * as Icons from '../Icons';

export type ModalCreateClansProps = {
    open: boolean;
    onClose: () => void;
};

const ModalCreateClans = (props: ModalCreateClansProps) => {
    const { open, onClose } = props
    const [urlImage, setUrlImage] = useState('');
    const [nameClan, setNameClan] = useState('');
    const handleFile = (e: any) => {
        // const fileToStore: File = e.target.file[0];
        const fileToStore: File = e.target.files[0];
        setUrlImage(URL.createObjectURL(fileToStore))
    }
    const handleCreateClan = () => {
        //createClan
    }

    return (
        <>
            <Modal showModal={open} onClose={onClose} title='' titleConfirm='Create' confirmButton={handleCreateClan}>
                <div className="flex items-center flex-col justify-center">
                    <span>Customize Your Server</span>
                    <span>Give your new clan a personality with a name and an icon. You can always change it later.</span>
                    <label className="block">
                        {urlImage ? (
                            <img id='preview_img' className="h-16 w-16 object-cover rounded-full" src={urlImage} alt="Current profile photo" />

                        ) : (
                            <div id='preview_img' className="h-16 w-16 bg-[#fff] rounded-full">
                                <Icons.AddIcon />
                                <span>Upload</span>
                            </div>
                        )}
                        <input id='preview_img' type="file" onChange={(e) => handleFile(e)} className="block w-full text-sm text-slate-500 hidden" />
                    </label>
                    <span></span>
                    <InputField onChange={(e) => setNameClan(e.target.value)} type='text' className="w-full" />
                </div>
            </Modal>
        </>
    );
}

export default ModalCreateClans