import type React from "react"

import { MediaType, selectCurrentClanId, soundEffectActions, useAppDispatch } from "@mezon/store"
import { handleUploadEmoticon, useMezon } from "@mezon/transport"
import { Icons } from "@mezon/ui"
import { Snowflake } from "@theinternetfolks/snowflake"
import Modal from "libs/ui/src/lib/Modal"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import type { SoundType } from "./index"

interface ModalUploadSoundProps {
    sound?: SoundType | null
    onSuccess: (sound: SoundType) => void
    onClose: () => void
}

const ModalUploadSound = ({ sound, onSuccess, onClose }: ModalUploadSoundProps) => {
    const [file, setFile] = useState<File | null>(null)
    const [name, setName] = useState("")
    const [error, setError] = useState("")
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isDragOver, setIsDragOver] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const dispatch = useAppDispatch()
    const currentClanId = useSelector(selectCurrentClanId) || ''
    const { sessionRef, clientRef } = useMezon()

    useEffect(() => {
        if (sound) {
            setName(sound.name)
            setPreviewUrl(sound.url)
        }
    }, [sound])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return
        processFile(f)
    }

    const processFile = (f: File) => {
        if (!["audio/mp3", "audio/mpeg", "audio/wav"].includes(f.type)) {
            setError("Support file .mp3 or .wav")
            return
        }
        if (f.size > 1024 * 1024) {
            setError("File too big, max 1MB")
            return
        }
        setFile(f)
        setPreviewUrl(URL.createObjectURL(f))
        setError("")
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        const f = e.dataTransfer.files?.[0]
        if (f) processFile(f)
    }

    const handleUpload = async () => {
        if (!name.trim()) return

        setIsUploading(true)

        try {
            const session = sessionRef.current
            const client = clientRef.current

            if (!client || !session) {
                throw new Error('Client or session is not initialized')
            }
            if (sound && !file) {
                const request = {
                    id: sound.id,
                    clan_id: currentClanId,
                    shortname: name.trim(),
                    source: sound.url,
                    media_type: MediaType.AUDIO
                }

                await dispatch(soundEffectActions.updateSound({
                    soundId: sound.id,
                    request
                }))

                onSuccess({
                    id: sound.id,
                    name: name.trim(),
                    url: sound.url,
                    creator_id: sound.creator_id
                })
                return
            }

            if (!file) return

            const id = sound?.id || Snowflake.generate()
            const path = 'sounds/' + id + '.' + file.name.split('.').pop()

            const attachment = await handleUploadEmoticon(client, session, path, file)

            if (attachment && attachment.url) {
                const request = {
                    id: id,
                    category: "Among Us",
                    clan_id: currentClanId,
                    shortname: name.trim(),
                    source: attachment.url,
                    media_type: MediaType.AUDIO
                }

                if (sound) {
                    await dispatch(soundEffectActions.updateSound({
                        soundId: id,
                        request
                    }))
                } else {
                    await dispatch(soundEffectActions.createSound({ request, clanId: currentClanId }))
                }

                onSuccess({
                    id: id,
                    name: name.trim(),
                    url: attachment.url,
                    creator_id: sound?.creator_id
                })
            }
        } catch (error) {
            console.error("Error uploading sound:", error)
            setError("Failed to upload sound")
        } finally {
            setIsUploading(false)
        }
    }

    const formatFileSize = (bytes: number) => {
        return (bytes / 1024).toFixed(1) + " KB"
    }

    const removeFile = () => {
        setFile(null)
        setPreviewUrl(null)
        setError("")
        if (inputRef.current) inputRef.current.value = ""
    }

    return (
        <Modal showModal={true} onClose={onClose} title="" classNameBox="max-w-[550px] w-full !p-0 overflow-hidden">
            <div className="relative">
                <div className="absolute inset-0 bg-gray-100 dark:bg-[#36393f]"></div>

                <div className="relative">
                    <div className="relative px-4 pt-4 pb-3 border-b border-gray-300 dark:border-[#42464d]">
                        <div className="text-center">
                            <h2 className="text-lg font-bold text-colorTextLightMode dark:text-white">
                                {sound ? 'Edit Sound Effect' : 'Upload Sound Effect'}
                            </h2>
                            <p className="text-gray-500 dark:text-[#b9bbbe] text-xs">
                                Supports MP3, WAV formats • Max 1MB
                            </p>
                        </div>
                    </div>

                    <div className="p-4 flex flex-col max-h-[80vh] md:h-[400px]">
                        <div className="flex-1 flex flex-col overflow-hidden overflow-y-auto gap-3">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold uppercase text-colorTextLightMode dark:text-[#ffffff]">Preview</span>
                                </div>

                                <div className="flex items-center justify-center rounded-lg border border-gray-300 dark:border-[#42464d] overflow-hidden min-h-[140px] md:h-36">
                                    <div className="relative h-full w-full flex items-center justify-center bg-gray-200 dark:bg-[#2f3136] py-3">
                                        {previewUrl ? (
                                            <div className="flex flex-col items-center w-full px-4">
                                                <div className="w-12 h-12 bg-[#5865f2] rounded-full flex items-center justify-center mb-2">
                                                    <Icons.Speaker defaultFill="text-white " />
                                                </div>
                                                <audio
                                                    controls
                                                    src={previewUrl}
                                                    className="w-full min-w-[250px] max-w-[380px] h-10"
                                                />
                                            </div>
                                        ) : (
                                                <Icons.UploadSoundIcon className="w-12 h-12 text-gray-500 dark:text-[#b9bbbe]" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-3 text-colorTextLightMode dark:text-[#ffffff]">
                                <div className="w-full md:w-1/2 flex flex-col gap-1">
                                    <p className="text-xs font-bold uppercase">Audio File</p>
                                    <div
                                        className={`
                                            relative group transition-all duration-200
                                            ${isDragOver ? "scale-[1.02]" : "scale-100"}
                                        `}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            ref={inputRef}
                                            type="file"
                                            accept="audio/mp3,audio/mpeg,audio/wav"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            onChange={handleFileChange}
                                        />

                                        <div
                                            className={`
                                                relative border-2 border-dashed rounded-md p-2 transition-all duration-200 h-[60px]
                                                ${file
                                                    ? "border-[#5865f2] bg-[#4752c440] dark:border-[#5865f2] dark:bg-[#4752c420]"
                                                    : isDragOver
                                                        ? "border-[#5865f2] bg-[#4752c440] dark:border-[#5865f2] dark:bg-[#4752c420]"
                                                    : "border-gray-300 bg-gray-200 dark:border-[#42464d] dark:bg-[#2f313680] hover:border-[#5865f2] hover:bg-[#4752c420]"
                                                }
                                            `}
                                        >
                                            {!file ? (
                                                <div className="flex items-center justify-between h-full px-2">
                                                    <p className="text-xs text-gray-500 dark:text-[#b9bbbe] truncate">Choose or drop a file</p>
                                                    <button className="hover:bg-[#4752c4] bg-[#5865f2] rounded-[4px] py-1 px-2 text-nowrap text-white text-xs">
                                                        Browse
                                                    </button>
                                                </div>
                                            ) : (
                                                    <div className="flex items-center gap-2 py-1 px-2 h-full">
                                                        <div className="relative">
                                                            <div className="w-8 h-8 bg-[#5865f2] rounded-full flex items-center justify-center">
                                                                <Icons.Speaker defaultFill="text-white " />
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-semibold text-colorTextLightMode dark:text-[#ffffff] truncate">
                                                                {file.name}
                                                            </h4>
                                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#b9bbbe]">
                                                                <span>{formatFileSize(file.size)}</span>
                                                                <span>{file.type.split("/")[1].toUpperCase()}</span>
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                removeFile()
                                                            }}
                                                            className="w-7 h-7 bg-gray-300 hover:bg-gray-400 dark:bg-[#4f545c80] dark:hover:bg-[#4f545c] rounded-full flex items-center justify-center transition-all duration-200 to-colorDangerHover z-40"
                                                        >
                                                            <Icons.Close className="w-3.5 h-3.5 text-colorTextLightMode dark:text-[#ffffff]" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-1/2 flex flex-col gap-1">
                                    <p className="text-xs font-bold uppercase">Sound Name</p>
                                    <div className="relative bg-gray-200 dark:bg-[#202225] border border-gray-300 dark:border-[#42464d] rounded-md h-[60px] flex items-center">
                                        <input
                                            type="text"
                                            placeholder="Ex.cat hug"
                                            value={name}
                                            maxLength={30}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full h-full px-3 py-2 bg-gray-200 dark:bg-[#202225] text-colorTextLightMode dark:text-[#ffffff] border-none rounded-md text-sm focus:outline-none focus:ring-0 focus:border-none placeholder:text-gray-500 dark:placeholder:text-[#72767d]"
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <span
                                                className={`text-xs font-medium ${name.length > 25 ? "text-[#faa61a]" : "text-gray-500 dark:text-[#72767d]"}`}
                                            >
                                                {name.length}/30
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-3 p-2 bg-[#f04747] bg-opacity-10 rounded-md animate-in slide-in-from-top-2 duration-300">
                                    <div className="flex-shrink-0">
                                        <Icons.AppHelpIcon className="w-4 h-4 text-[#f04747]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#f04747]">{error}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-gray-300 dark:border-[#42464d]">
                            <button
                                className="px-3 py-1.5 bg-transparent text-colorTextLightMode dark:text-[#ffffff] rounded-md text-sm font-medium hover:underline transition-all duration-200"
                                onClick={onClose}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-3 py-1.5 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-md text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleUpload}
                                disabled={(!file && !sound) || !name.trim() || isUploading}
                            >
                                {isUploading ? (
                                    <span className="flex items-center gap-1.5">
                                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Uploading...
                                    </span>
                                ) : (
                                        sound ? "Update" : "Upload"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ModalUploadSound
