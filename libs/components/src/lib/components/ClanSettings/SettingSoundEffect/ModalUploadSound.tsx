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
        <Modal showModal={true} onClose={onClose} title="" classNameBox="max-w-[580px] !p-0 overflow-hidden">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]"></div>

                <div className="relative backdrop-blur-sm">
                    <div className="relative px-8 pt-8 pb-6">

                        <div className="text-center">
                            <div className="relative inline-flex mb-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25 dark:shadow-blue-500/15">
                                    <Icons.SoundIcon className="w-10 h-10 text-white dark:text-white" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                                Upload Sound Effect
                            </h2>
                        </div>
                    </div>

                    <div className="px-8 pb-8 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">Select Audio File</span>
                            </div>

                            <div
                                className={`
                  relative group transition-all duration-300 ease-out
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
                    relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300
                    ${file
                                            ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50 dark:border-emerald-600 dark:from-emerald-900/10 dark:to-green-900/10"
                                            : isDragOver
                                                ? "border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 dark:border-blue-500 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-lg shadow-blue-500/10"
                                                : "border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 dark:hover:border-blue-500 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10"
                                        }
                  `}
                                >
                                    {!file ? (
                                        <div className="text-center">
                                            <div className="relative inline-flex mb-4">
                                                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-100 dark:group-hover:from-blue-900/20 dark:group-hover:to-indigo-900/20 transition-all duration-300">
                                                    <Icons.UploadSoundIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300" />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center shadow-lg">
                                                    <span className="text-white text-xs font-bold">+</span>
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                {isDragOver ? "Drop file here" : "Drag & drop or click to select"}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                Supports MP3, WAV formats • Max 1MB
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl flex items-center justify-center">
                                                    <Icons.Speaker className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 dark:bg-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                                                    <Icons.Check className="w-3 h-3 text-white" />
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-1">
                                                    {file.name}
                                                </h4>
                                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <Icons.UploadSoundIcon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                                        {formatFileSize(file.size)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Icons.Speaker className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                                        {file.type.split("/")[1].toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    removeFile()
                                                }}
                                                className="w-10 h-10 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl flex items-center justify-center transition-all duration-200 group"
                                            >
                                                <Icons.UploadSoundIcon className="w-4 h-4 text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {previewUrl && (
                            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full"></div>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Preview</span>
                                </div>

                                <div className="relative p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-2xl border">
                                    <audio
                                        controls
                                        src={previewUrl}
                                        className="w-full h-12 rounded-full shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm "
                                    />

                                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-3 font-medium">
                                        ✨ Check audio quality before saving
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full"></div>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">Name Sound Effect</span>
                            </div>

                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                    <Icons.PenEdit className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                </div>

                                <input
                                    type="text"
                                    placeholder="Example: Notification Bell, Success Chime..."
                                    value={name}
                                    maxLength={30}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-12 pr-16 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                />

                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <span
                                        className={`text-xs font-medium ${name.length > 25 ? "text-orange-500 dark:text-orange-400" : "text-gray-400 dark:text-gray-500"}`}
                                    >
                                        {name.length}/30
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                Short names help with searching and usage later
                            </p>
                        </div>

                        {error && (
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 border border-red-200 dark:border-red-800/30 rounded-xl animate-in slide-in-from-top-2 duration-300">
                                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                                    <Icons.AppHelpIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">An error occurred</p>
                                    <p className="text-xs text-red-600 dark:text-red-500">{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 pt-6">
                            <button
                                className="flex-1 relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white rounded-xl py-4 px-6 font-semibold transition-all duration-300 shadow-xl shadow-blue-500/25 dark:shadow-blue-500/15 hover:shadow-2xl hover:shadow-blue-500/40 dark:hover:shadow-blue-500/20 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg group"
                                onClick={handleUpload}
                                disabled={!file || !name.trim() || isUploading}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                <span className="relative flex items-center justify-center gap-3">
                                    {isUploading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            Upload Sound Effect
                                        </>
                                    )}
                                </span>
                            </button>

                            <button
                                className="px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ModalUploadSound
