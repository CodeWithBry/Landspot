"use client"

import { navContext } from "@/context/NavigationProvider"
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { ProfileType } from "@/types/AuthContextType";
import { NavigationContextType } from "@/types/NavigationContextType";
import { Eye, Menu, Pencil, Save, Trash, X } from "lucide-react";
import { ChangeEvent, FormEvent, MouseEvent, useContext, useEffect, useRef, useState } from "react"

function Profile() {
    const { showMenu, setShowMenu } = useContext(navContext) as NavigationContextType;
    const { getProfile, updateProfilePicture, updateProfile } = useAuth();
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploaded, setUploaded] = useState<boolean>(false);
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
    const [menuPosition, setMenuPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    function handleOnContextMenu(e: MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        if (menuRef.current && menuRef.current.contains(e.target as Node)) return;
        setIsMenuVisible(true);
        const screenX = window.innerWidth;
        const screenY = window.innerHeight;
        setMenuPosition({
            x: e.clientX + 200 > screenX ? e.clientX - ((e.clientX + 200) - screenX) : e.clientX,
            y: e.clientY + 200.86 > screenY ? e.clientY - ((e.clientY + 200.86) - screenY) : e.clientY,
        });
    }

    function handleContentOnChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, object_name: keyof ProfileType) {
        if (!isEditing) return;

        const value = e.target.value;
        setProfile(prev => prev ? ({ ...prev, [object_name]: value }) : null);
    }

    async function handleOnPictureChange(e: ChangeEvent<HTMLInputElement>) {
        setIsUploading(true);
        setUploaded(false);
        try {
            const file: File | null = e.target?.files ? e.target.files[0] : null;
            if (file && profile) {
                const result = await updateProfilePicture(file, profile.profile_id);
                if (result) setProfile(prev => prev ? ({ ...prev, photo_url: result }) : null);
            }
        } catch (error) {
            throw error;
        } finally {
            setIsUploading(false);
            setUploaded(true);
        }
    }

    async function handleSaveChanged() {
        if (profile) updateProfile(profile);
        setIsEditing(false);
    }

    useEffect(() => {
        getProfile()
            .then(res => {
                if (res && typeof res) {
                    setProfile(res);
                }
            })
            .catch(e => {
                throw e;
            })
            .finally(() => {
                setIsLoading(false);
            }) 
    }, [])

    useEffect(() => {
        if (menuRef.current) {
            function handleClickOutside(event: globalThis.MouseEvent) {
                if (menuRef.current && (!menuRef.current.contains(event.target as Node))) {
                    setIsMenuVisible(false);
                }
            }

            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);

        }
    }, [menuRef.current])

    useEffect(() => {
        console.log(profile?.photo_url)
    }, [profile])

    return (
        <section className="w-full h-full flex justify-center overflow-x-hidden overflow-y-scroll z-0">
            <div
                className={`min-w-70 max-w-200 w-full h-full flex flex-col mx-5 mt-5`}>
                {/* Profile */}
                <header className="flex w-full justify-between">
                    <h2 className="text-black font-serif sm:text-2xl text-lg font-bold flex gap-2 place-items-center sticky top-0 z-1 bg-white py-2">
                        <button
                            onClick={() => setShowMenu(prev => !prev)}
                            className='sm:p-3 p-1 rounded-full transition cursor-pointer hover:bg-accent-400 hover:text-white'>
                            {
                                !showMenu ? <Menu size={18} /> : <X size={18} />
                            }
                        </button>
                        <span>Profile Settings</span>
                    </h2>

                    <div className="flex items-center gap-2">
                        {
                            isEditing ?
                                <>
                                    <button
                                        className="btn font-serif text-white bg-red-600 hover:bg-accent-700"
                                        onClick={() => setIsEditing(false)}>
                                        <X scale={1.0} size={14} fill="white" />
                                        Cancel
                                    </button>
                                    <button
                                        className="btn font-serif text-white bg-green-400 hover:bg-green-500"
                                        onClick={handleSaveChanged}>
                                        <Save scale={1.0} size={14} fill="white" />
                                        Save
                                    </button>
                                </> :
                                <button
                                    className="btn font-serif text-white bg-accent-400 hover:bg-accent-500"
                                    onClick={() => setIsEditing(true)}>
                                    <Pencil scale={1.0} size={14} fill="white" />
                                    Edit
                                </button>
                        }
                    </div>
                </header>
                <hr className="w-[97.5%] h-px text-gray-300 block mx-auto rounded-full" />

                <div className={`flex flex-col w-full h-fit my-2  ${isLoading ? "block" : "hidden"}`}>
                    <div className="flex flex-col md:flex-row gap-4 mx-10 my-4">
                        <div className="w-full listing-skeleton h-60 md:w-40 md:h-40 flex shrink-0 justify-center items-center md:rounded-full md:overflow-hidden" />

                        <div className="flex flex-col my-auto font-serif w-full gap-2">
                            <div className="flex flex-col gap-1.5">
                                <div className="listing-skeleton flex flex-col w-full gap-1.5 rounded-md full h-10 text-sm px-2 py-1.5" />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                                <div className="listing-skeleton flex flex-col w-full gap-1.5 rounded-md full h-10 text-sm px-2 py-1.5" />
                                <div className="listing-skeleton flex flex-col w-full gap-1.5 rounded-md full h-10 text-sm px-2 py-1.5" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mx-10">
                        <div className="w-full h-px bg-gray-300 flex flex-col md:flex-row gap-4 my-4" />
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <div className="listing-skeleton flex flex-col w-full gap-1.5 rounded-md full h-10 text-sm px-2 py-1.5" />
                            <div className="listing-skeleton flex flex-col w-full gap-1.5 rounded-md full h-10 text-sm px-2 py-1.5" />
                        </div>
                        <div className="listing-skeleton flex flex-col w-full gap-1.5 rounded-md full text-sm h-40 px-2 py-1.5" />
                    </div>
                </div>


                <div className={`flex flex-col w-full h-fit my-2  ${isLoading && "hidden"}`}>
                    <div className="flex flex-col md:flex-row gap-4 mx-10 my-4">
                        <div
                            className="w-full bg-gray-300 h-60 md:w-40 md:h-40 flex shrink-0 justify-center items-center border-3 border-gray-500 md:rounded-full md:overflow-hidden"
                            onContextMenu={handleOnContextMenu} >
                            {/* <label className="absolute w-full h-full flex justify-center items-center opacity-0 bg-semi-transparent hover:opacity-100 transition-all" htmlFor="profile-picture">
                                <Pencil className="w-auto h-[40%]" scale={1} />
                            </label> */}
                            {
                                isUploading && !uploaded ?
                                    <div className="w-full h-full flex justify-center items-center">
                                        <div className="border-5 border-accent-500 border-b-transparent w-12 h-12 bg-transparent animate-spin rounded-full" />
                                    </div> :
                                    <img src={profile?.photo_url ?? "/empty-profile.svg"} alt="profile-picture" className="w-auto h-full " />
                            }

                            <div
                                ref={menuRef}
                                className={`rounded-md shadow-md absolute bg-white ${isMenuVisible ? 'block' : 'hidden'}`}
                                style={{
                                    left: menuPosition.x,
                                    top: menuPosition.y
                                }} >
                                <label
                                    htmlFor="profile-picture"
                                    className="btn w-full px-2 py-2 flex items-center gap-2 hover:bg-gray-300">
                                    <Pencil size={10} />
                                    Change Photo
                                </label>
                                <button
                                    className="btn w-full px-2 py-2 flex items-center gap-2 hover:bg-gray-300"
                                    onClick={() => { }}>
                                    <Eye size={10} />
                                    View Photo
                                </button>
                                <button
                                    className="btn w-full px-2 py-2 flex items-center gap-2 hover:bg-gray-300"
                                    onClick={() => { }}>
                                    <Trash size={10} />
                                    Delete Photo
                                </button>
                            </div>
                            <input
                                type="file"
                                accept="images"
                                id="profile-picture"
                                className="hidden"
                                onChange={handleOnPictureChange} />
                        </div>

                        <div className="flex flex-col my-auto font-serif w-full gap-2">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-black text-sm font-semibold">User Name</span>
                                <input type="text" id="profile-name" value={profile?.user_name ?? ""} className="border-2 border-gray-800 rounded-md full h-auto text-sm px-2 py-1.5" />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                                <label htmlFor="first-name" className="flex flex-col w-full gap-1.5">
                                    <span className="text-black text-sm font-semibold">First Name</span>
                                    <input
                                        type="text"
                                        id="first-name"
                                        value={profile?.first_name ?? ""}
                                        className="border-2 border-gray-800 rounded-md full h-auto text-sm px-2 py-1.5"
                                        onChange={(e) => handleContentOnChange(e, "first_name")} />
                                </label>
                                <label htmlFor="last-name" className="flex flex-col w-full gap-1.5">
                                    <span className="text-black text-sm font-semibold">Last Name</span>
                                    <input
                                        type="text"
                                        id="last-name"
                                        value={profile?.last_name ?? ""}
                                        className="border-2 border-gray-800 rounded-md full h-auto text-sm px-2 py-1.5"
                                        onChange={(e) => handleContentOnChange(e, "last_name")} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mx-10">
                        <div className="w-full h-px bg-gray-300 flex flex-col md:flex-row gap-4 my-4" />
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <label htmlFor="email" className="flex flex-col w-full gap-1.5">
                                <span className="text-black text-sm font-semibold">Email</span>
                                <input
                                    type="text"
                                    value={profile?.email ?? ""}
                                    contentEditable={isEditing}
                                    id="email"
                                    className="border-2 border-gray-800 rounded-md full h-auto text-sm px-2 py-1.5"
                                    onChange={(e) => handleContentOnChange(e, "email")} />
                            </label>
                            <label htmlFor="contact-number" className="flex flex-col w-full gap-1.5">
                                <span className="text-black text-sm font-semibold">Contact Number</span>
                                <input
                                    type="text"
                                    id="contact-number"
                                    value={profile?.phone_number ?? ""}
                                    contentEditable={isEditing}
                                    className="border-2 border-gray-800 rounded-md full h-auto text-sm px-2 py-1.5"
                                    onChange={(e) => handleContentOnChange(e, "phone_number")} />
                            </label>
                        </div>
                        <span className="text-black text-sm font-semibold mx-2">Agent Description</span>
                        <textarea
                            rows={5}
                            value={profile?.bio ?? ""}
                            onChange={(e) => handleContentOnChange(e, "bio")}
                            className="border-2 border-gray-800 mb-2 resize-none rounded-md full h-auto text-sm px-2 py-1.5" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Profile