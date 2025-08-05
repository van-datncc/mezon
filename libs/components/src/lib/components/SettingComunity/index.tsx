"use client"

import type React from "react"

import { comunityActions, selectCommunityBanner, selectComunityError, selectComunityLoading, selectIsCommunityEnabled, useAppDispatch, useAppSelector } from "@mezon/store"
import { handleUploadEmoticon, useMezon } from "@mezon/transport"
import { Icons } from "@mezon/ui"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import { ModalSaveChanges } from "../../components"
import EnableComunity from "../EnableComunityClan"

const SettingComunity = ({
  clanId,
  onClose,
  onCommunityEnabledChange,
}: { clanId: string; onClose?: () => void; onCommunityEnabledChange?: (enabled: boolean) => void }) => {
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(selectComunityLoading)
  const error = useAppSelector(selectComunityError)

  const isEnabledFromStore = useAppSelector(selectIsCommunityEnabled(clanId));
  const bannerFromStore = useAppSelector(selectCommunityBanner(clanId));

  const [isEnabled, setIsEnabled] = useState(false)
  const [isInitialEditing, setIsInitialEditing] = useState(false)
  const [banner, setBanner] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [about, setAbout] = useState("")
  const [initialBanner, setInitialBanner] = useState<string | null>(null)
  const [initialAbout, setInitialAbout] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [openSaveChange, setOpenSaveChange] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { sessionRef, clientRef } = useMezon();
  const isDirty = about !== initialAbout || bannerPreview !== initialBanner

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBanner(file);
    setBannerPreview(URL.createObjectURL(file));
    if (isEnabled) setOpenSaveChange(true);
    e.target.value = "";
  };

  const handleChangeAbout = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAbout(e.target.value)
    if (isEnabled) setOpenSaveChange(true)
  }

  const handleEnable = () => setIsInitialEditing(true)

  const handleConfirmEnable = async () => {
    setIsSaving(true);
    try {
      await dispatch(comunityActions.updateCommunityStatus({ clan_id: clanId, enabled: true })).unwrap();
      let bannerUrl = bannerPreview;
      if (banner) {
        const client = clientRef.current;
        const session = sessionRef.current;
        if (!client || !session) throw new Error('Client/session not ready');
        const path = 'community-banner/' + clanId + '.' + (banner.name.split('.').pop() || 'jpg');
        const attachment = await handleUploadEmoticon(client, session, path, banner);
        if (attachment && attachment.url) {
          bannerUrl = attachment.url;
          await dispatch(comunityActions.updateCommunityBanner({ clan_id: clanId, bannerUrl })).unwrap();
        }
      }
      setInitialAbout(about);
      setInitialBanner(bannerUrl);
      setIsEnabled(true);
      setIsInitialEditing(false);
      onCommunityEnabledChange?.(true);
      toast.success("Community enabled and saved!");
    } catch (e) {
      toast.error("Save failed!");
    } finally {
      setIsSaving(false);
    }
  }

  const handleReset = () => {
    setAbout(initialAbout)
    setBannerPreview(initialBanner)
    setBanner(null)
    setOpenSaveChange(false)
  }

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      let bannerUrl = bannerPreview;
      if (banner) {
        const client = clientRef.current;
        const session = sessionRef.current;
        if (!client || !session) throw new Error('Client/session not ready');
        const path = 'community-banner/' + clanId + '.' + (banner.name.split('.').pop() || 'jpg');
        const attachment = await handleUploadEmoticon(client, session, path, banner);
        if (attachment && attachment.url) {
          bannerUrl = attachment.url;
          await dispatch(comunityActions.updateCommunityBanner({ clan_id: clanId, bannerUrl })).unwrap();
        }
      }
      setInitialAbout(about);
      setInitialBanner(bannerUrl);
      setOpenSaveChange(false);
      setBanner(null);
      toast.success("Changes saved!");
    } catch {
      toast.error("Save failed!");
    } finally {
      setIsSaving(false);
    }
  }

  const handleDisable = async () => {
    setIsSaving(true)
    try {
      await dispatch(comunityActions.updateCommunityStatus({ clan_id: clanId, enabled: false })).unwrap()
      setIsEnabled(false)
      setAbout("")
      setBanner(null)
      setBannerPreview(null)
      setInitialAbout("")
      setInitialBanner(null)
      setOpenSaveChange(false)
      onCommunityEnabledChange?.(false)
      toast.info("Community disabled.")
    } catch {
      toast.error("Disable failed!")
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveBanner = async () => {
    setBanner(null);
    setBannerPreview(null);
    setOpenSaveChange(true);
    if (isEnabled) {
      await dispatch(comunityActions.updateCommunityBanner({ clan_id: clanId, bannerUrl: "" })).unwrap();
      setInitialBanner("");
      toast.success("Banner removed!");
    }
  };

  useEffect(() => {
    setIsEnabled(isEnabledFromStore);
  }, [isEnabledFromStore]);

  useEffect(() => {
    setBannerPreview(bannerFromStore);
    setInitialBanner(bannerFromStore);
  }, [bannerFromStore]);

  if (!isEnabled && !isInitialEditing) {
    return <EnableComunity onEnable={handleEnable} />
  }

  if (!isEnabled && isInitialEditing) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="relative max-w-2xl w-full bg-gradient-to-br from-white to-gray-50 dark:from-theme-setting-primary dark:to-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
              onClick={() => setIsInitialEditing(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-3xl font-bold mb-2"> Enable Community</h2>
            <p className="text-blue-100">Create a great space for your members to connect</p>
          </div>

          <div className="p-8 space-y-8 bg-theme-setting-primary">
            {/* Banner Section */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Community Banner
              </label>

              <div className="relative group">
                {bannerPreview ? (
                  <div className="relative w-full h-52 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={bannerPreview || "/placeholder.svg"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Nút xóa banner */}
                    <button
                      type="button"
                      onClick={handleRemoveBanner}
                      className="z-20 absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600 rounded-full p-2 shadow transition"
                      title="Remove Banner"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    {/* Overlay Change Banner */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto z-10">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-indigo-400 px-6 text-white py-3 rounded-lg font-medium hover:bg-indigo-500 transition-colors duration-200 shadow-lg"
                      >
                        Change Banner
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer w-full h-48 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-300 flex flex-col items-center justify-center text-theme-primary hover:text-blue-500 dark:hover:text-blue-400 bg-theme-setting-primary hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Icons.ImageUploadIcon className="w-12 h-12 mb-3 transition-transform duration-300 hover:scale-110" />
                    <p className="text-lg font-medium">Upload Banner</p>
                    <p className="text-sm opacity-75">Drag & drop or click to select an image</p>
                  </div>
                )}
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
            </div>

            {/* About Section */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                About Community
              </label>

              <div className="relative">
                <textarea
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-theme-input text-theme-primary  focus:border-blue-400 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200 resize-none"
                  rows={5}
                  value={about}
                  onChange={handleChangeAbout}
                  placeholder="Tell us about your community... What makes it special?"
                  maxLength={300}
                />
                <div className="absolute bottom-3 right-3 text-sm  bg-theme-setting-primary text-theme-primary border border-theme-primary px-2 py-1 rounded-md">
                  <span
                    className={
                      about.length > 250 ? "text-orange-500" : about.length > 280 ? "text-red-500" : "text-gray-500"
                    }
                  >
                    {about.length}
                  </span>
                  <span className="text-gray-400">/300</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleConfirmEnable}
                disabled={isSaving}
                className="group relative px-8 py-3 btn-primary btn-primary-hover font-semibold rounded-xl shadow-lg hover:shadow-xl transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Enable & Save
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-theme-setting-primary rounded-2xl shadow-xl border border-theme-primary overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Community Settings</h2>
              <p className="text-green-100">Manage your community information</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8 bg-theme-setting-nav">
          {/* Banner Section */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-lg font-semibold text-theme-primary-active">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Community Banner
            </label>
            <div className="relative group">
              {bannerPreview ? (
                <div className="relative w-full h-52 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={bannerPreview || "/placeholder.svg"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* <button
                    type="button"
                    onClick={handleRemoveBanner}
                    className="z-20 absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600 rounded-full p-2 shadow transition"
                    title="Remove Banner"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button> */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto z-10">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-indigo-400 px-6 text-white py-3 rounded-lg font-medium hover:bg-indigo-500 transition-colors duration-200 shadow-lg"
                    >
                      Change Banner
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer group relative w-full h-52 rounded-xl border-2 border-dashed hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 flex items-center justify-center text-theme-primary bg-theme-setting-primary  "
                >
                  <div className="text-center">
                    <Icons.ImageUploadIcon className="w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 text-theme-primary group-hover:text-blue-500" />
                    <p className="text-xl font-medium mb-2">Upload Banner</p>
                    <p className="text-sm opacity-75">Drag & drop or click to select an image</p>
                  </div>
                </div>
              )}
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              About Community
            </label>

            <div className="relative">
              <textarea
                className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-theme-input text-theme-primary  focus:border-blue-400 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200 resize-none"
                rows={6}
                value={about}
                onChange={handleChangeAbout}
                placeholder="Tell us about your community... What makes it special?"
                maxLength={300}
              />
              <div className="absolute bottom-3 right-3 text-sm  bg-theme-setting-primary text-theme-primary border border-theme-primary px-2 py-1 rounded-md">
                <span
                  className={
                    about.length > 250 ? "text-orange-500" : about.length > 280 ? "text-red-500" : "text-gray-500"
                  }
                >
                  {about.length}
                </span>
                <span className="text-gray-400">/300</span>
              </div>
            </div>
          </div>

          {/* Save Changes Modal */}
          {openSaveChange && isDirty && (
            <ModalSaveChanges onSave={handleSaveChanges} onReset={handleReset} isLoading={isSaving} />
          )}

          {/* Action Buttons */}
          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleDisable}
              className="group px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-center gap-2">

                Disable Community
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingComunity
