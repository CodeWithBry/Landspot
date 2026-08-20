"use client";

import MapView from "@/components/map/MapView";
import { useAuth } from "@/hooks/useAuth";
import { useListing } from "@/hooks/useListings";
import { X } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";

export default function page() {
    const { login, loadingAuthentication, failedToAuthenticate, setFailedToAuthenticate } = useAuth();
    const { listings, onBoundsChange } = useListing();
    const [rememberMe, setRememberMe] = useState<boolean>();
    const [form, setForm] = useState<{ email: string, password: string }>({
        email: "", password: ""
    });

    function handleOnCheck(e: ChangeEvent<HTMLInputElement>) {
        var isChecked: boolean = e.currentTarget.checked;
        setRememberMe(isChecked);
        localStorage.setItem("remember_me", JSON.stringify(isChecked))
    }

    function handleSubmit() {
        if (rememberMe) {
            localStorage.setItem("remembered_email", JSON.stringify(form.email));
        } else {
            localStorage.removeItem("remembered_email");
            localStorage.removeItem("remember_me");
        }
        login(form.email, form.password);
    }

    useEffect(() => {
        if (failedToAuthenticate) {
            const timeout = setTimeout(() => {
                setFailedToAuthenticate(false);
            }, 1500);
            return () => clearTimeout(timeout);
        }
    }, [failedToAuthenticate])

    useEffect(() => {
        const isRememberMe = JSON.parse(localStorage.getItem("remember_me")!)
        const rememberedEmail = JSON.parse(localStorage.getItem("remembered_email")!)

        if(isRememberMe) {
            setRememberMe(isRememberMe);
            setForm(prev => ({...prev, email: rememberedEmail}))
        }
    }, [])

    return (
        <section className="w-full h-full flex justify-center md:grid lg:grid-cols-2 items-center py-10 relative">
            {/* loading animation */}

            {(failedToAuthenticate || loadingAuthentication) && <div className="absolute z-1 w-full h-full top-0 left-0 bg-semi-transparent flex place-items-center justify-center">
                {
                    loadingAuthentication ?
                        <div className="border-5 border-accent-500 border-b-transparent w-12 h-12 bg-transparent animate-spin rounded-full" /> :
                        failedToAuthenticate && <div className="flex flex-col justify-center place-items-center bg-red-100 w-50 h-50 gap-1 border-2 border-red-600 rounded-xl text-red-600">
                            <div className="flex justify-center place-items-center w-16 h-16 rounded-full border-3 border-red-600">
                                <X size={10} className="shrink-0 w-10 h-10" />
                            </div>
                            <h1 className="text-red-600 text-xl font-serif">Error Occured.</h1>
                        </div>
                }
            </div>}

            <div className="w-50% h-full lg:flex hidden items-center justify-center relative z-0">
                <div className="w-[90%] h-[90%] shadow-md rounded-2xl overflow-hidden flex">
                    <MapView onBoundsChange={onBoundsChange} listings={listings} />
                </div>
            </div>
            <div className="md:w-50% md:py-0 py-4 mx-4 w-full h-full flex md:items-center align-middle justify-center">
                <div className="w-fit h-fit flex flex-col gap-4">
                    <div className="flex-col flex gap-1 mb-10">
                        <h1 className="font-bold text-3xl w-full text-center font-serif">Welcome Back Landers!</h1>
                        <p className="font-serif text-center text-text-muted">Please enter your account details.</p>
                    </div>

                    <label className="flex flex-col gap-1">
                        <span className="text-black font-semibold font-serif">Email</span>
                        <input
                            className="border border-text-muted font-serif py-2 px-2 indent-3" type="email"
                            value={form.email ?? ""}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, email: e.target.value }))} />
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-black font-semibold font-serif">Password</span>
                        <input
                            className="border border-text-muted font-serif py-2 px-2 indent-3"
                            type="password"
                            value={form.password}
                            onKeyDown={async (e: KeyboardEvent<HTMLInputElement>) => { if (e.key == "Enter") handleSubmit() }}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, password: e.target.value }))} />
                    </label>

                    <div className="flex justify-between w-full">
                        <label htmlFor="remember-me" className="flex gap-2 align-middle items-center">
                            <input
                                type="checkbox"
                                className="w-5 h-5"
                                id="remmeber-me"
                                onChange={handleOnCheck}
                                checked={rememberMe} />
                            <span className="font-serif">Remember Me</span>
                        </label>

                        {/* <Link className="font-serif underline text-text-muted" href={"/signup"}>
                            Create Account
                        </Link> */}
                    </div>

                    <button
                        className="w-full py-3 bg-primary-500 cursor-pointer text-white font-serif font-semibold active:bg-primary-600"
                        onClick={handleSubmit}>Login</button>

                    <div className="flex gap-2 w-full items-center">
                        <hr className="bg-gray-500 h-0.5 w-full" />
                        <span className="font-semibold text-sm text-gray-500 text-nowrap">OR CONTINUE WITH</span>
                        <hr className="bg-gray-500 h-0.5 w-full" />
                    </div>

                    <button
                        className="w-full flex items-center justify-center opacity-40 gap-2 py-3 bg-transparent border border-gray-400 cursor-pointer text-white font-serif font-semibold active:opacity-100" >
                        <img src="./google.png" width={30} height={30} />
                        <span className="text-black">Google</span>
                    </button>

                    <span className="font-serif font-semibold text-text-muted flex justify-center items-center mt-5 gap-1">
                        Doesn't have an account?
                        <Link href={"/signup"} className="text-primary-500 hover:underline">Create Account</Link>
                    </span>
                </div>
            </div>
        </section >
    )
}