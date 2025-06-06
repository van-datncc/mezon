"use client"

import type React from "react"

import { Icons } from "@mezon/ui"
import Modal from "libs/ui/src/lib/Modal"
import { useRef, useState } from "react"
import type { SoundType } from "./index"

interface ModalUploadSoundProps {
    onSuccess: (sound: SoundType) => void
    onClose: () => void
}

const ModalUploadSound = ({ onSuccess, onClose }: ModalUploadSoundProps) => {
    const [file, setFile] = useState<File | null>(null)
    const [name, setName] = useState("")
    const [error, setError] = useState("")
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isDragOver, setIsDragOver] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

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
        if (!file || !name.trim()) return

        setIsUploading(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))

        onSuccess({
            id: "sound-" + Date.now(),
            name: name.trim(),
            url: previewUrl || "",
        })
        setIsUploading(false)
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
        <Modal showModal={true} onClose={onClose} title="" classNameBox="max-w-[500px] !p-0 overflow-hidden">
            <div className="relative">
                <div className="absolute inset-0 bg-[#36393f] dark:bg-[#2f3136]"></div>

                <div className="relative">
                    <div className="relative px-5 pt-5 pb-4 border-b border-[#42464d] dark:border-[#42464d]">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-white mb-1">
                                Upload Sound Effect
                            </h2>
                            <p className="text-[#b9bbbe] text-sm">
                                Add custom sound effects for your server
                            </p>
                        </div>
                    </div>

                    <div className="px-5 py-4 space-y-5">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-semibold text-[#ffffff]">Select Audio File</span>
                            </div>

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
                    relative border-2 border-dashed rounded-md p-4 transition-all duration-200
                    ${file
                                        ? "border-[#5865f2] bg-[#4752c440] dark:border-[#5865f2] dark:bg-[#4752c420]"
                                            : isDragOver
                                            ? "border-[#5865f2] bg-[#4752c440] dark:border-[#5865f2] dark:bg-[#4752c420]"
                                            : "border-[#42464d] bg-[#2f313680] dark:border-[#42464d] dark:bg-[#2f313680] hover:border-[#5865f2] hover:bg-[#4752c420]"
                                        }
                  `}
                                >
                                    {!file ? (
                                        <div className="text-center py-8">
                                            <div className="relative inline-flex mb-3">
                                                <div className="w-14 h-14 bg-[#4f545c] rounded-full flex items-center justify-center">
                                                    <Icons.UploadSoundIcon className="w-6 h-6 text-[#b9bbbe] group-hover:text-[#ffffff]" />
                                                </div>
                                            </div>

                                            <h3 className="text-base font-semibold text-[#ffffff] mb-1">
                                                {isDragOver ? "Drop file here" : "Drag & drop or click to select"}
                                            </h3>
                                            <p className="text-xs text-[#b9bbbe]">
                                                Supports MP3, WAV formats • Max 1MB
                                            </p>
                                        </div>
                                    ) : (
                                            <div className="flex items-center gap-3 py-1">
                                            <div className="relative">
                                                    <div className="w-10 h-10 bg-[#5865f2] rounded-full flex items-center justify-center">
                                                        <Icons.Speaker className="w-5 h-5 text-white" />
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                    <h4 className="text-base font-semibold text-[#ffffff] truncate mb-0.5">
                                                    {file.name}
                                                </h4>
                                                    <div className="flex items-center gap-3 text-xs text-[#b9bbbe]">
                                                        <span className="flex items-center gap-1">
                                                        {formatFileSize(file.size)}
                                                    </span>
                                                        <span className="flex items-center gap-1">
                                                        {file.type.split("/")[1].toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    removeFile()
                                                }}
                                                    className="w-8 h-8 bg-[#4f545c80] hover:bg-[#4f545c] rounded-full flex items-center justify-center transition-all duration-200"
                                            >
                                                    <Icons.UploadSoundIcon className="w-4 h-4 text-[#ffffff]" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {previewUrl && (
                            <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-300">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-[#ffffff]">Preview</span>
                                </div>

                                <div className="relative p-3 bg-[#2f3136] rounded-md">
                                    <audio
                                        controls
                                        src={previewUrl}
                                        className="w-full h-10 rounded-full"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-[#ffffff]">Name Sound Effect</span>
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Example: Notification Bell, Success Chime..."
                                    value={name}
                                    maxLength={30}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-[#202225] text-[#ffffff] border border-[#42464d] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#5865f2] focus:border-[#5865f2] transition-all duration-200 placeholder:text-[#72767d]"
                                />

                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <span
                                        className={`text-xs font-medium ${name.length > 25 ? "text-[#faa61a]" : "text-[#72767d]"}`}
                                    >
                                        {name.length}/30
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-[#b9bbbe]">
                                Short names help with searching and usage later
                            </p>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 p-3 bg-[#f04747] bg-opacity-10 rounded-md animate-in slide-in-from-top-2 duration-300">
                                <div className="flex-shrink-0">
                                    <Icons.AppHelpIcon className="w-5 h-5 text-[#f04747]" />
                                </div>
                                <div>
                                    <p className="text-sm text-[#f04747]">{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-3 border-t border-[#42464d]">
                            <button
                                className="px-4 py-2 bg-transparent text-[#ffffff] rounded-md font-medium hover:underline transition-all duration-200"
                                onClick={onClose}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleUpload}
                                disabled={!file || !name.trim() || isUploading}
                            >
                                {isUploading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Uploading...
                                    </span>
                                ) : (
                                    "Upload"
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
