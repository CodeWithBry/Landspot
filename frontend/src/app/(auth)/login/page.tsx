"use client";

import MapView from "@/components/map/MapView";
import { useAuth } from "@/hooks/useAuth";
import { useListing } from "@/hooks/useListings";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

export default function page() {
    const { login } = useAuth();
    const { listings } = useListing();
    const [form, setForm] = useState<{ email: string, password: string }>({
        email: "", password: ""
    });

    return (
        <section className="w-full h-full grid grid-cols-2 items-center py-10">
            <div className="w-50% h-full flex items-center justify-center">
                <div className="w-[90%] h-[90%] shadow-md rounded-2xl overflow-hidden flex">
                    <MapView listings={listings} />
                </div>
            </div>
            <div className="w-50% h-full flex items-center align-middle justify-center">
                <div className="w-fit h-fit flex flex-col gap-4">
                    <div className="flex-col flex gap-1 mb-10">
                        <h1 className="font-bold text-3xl w-full text-left text-nowrap font-serif">Welcome Back Landers!</h1>
                        <p className="font-serif text-text-muted">Please enter your account details.</p>
                    </div>

                    <label className="flex flex-col gap-1">
                        <span className="text-black font-semibold font-serif">Email</span>
                        <input className="border border-text-muted font-serif py-2 px-2 indent-3" type="email" value={form.email} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, email: e.target.value }))} />
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-black font-semibold font-serif">Password</span>
                        <input className="border border-text-muted font-serif py-2 px-2 indent-3" type="password" value={form.password} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, password: e.target.value }))} />
                    </label>

                    <div className="flex justify-between w-full">
                        <label htmlFor="remember-me" className="flex gap-2 align-middle items-center">
                            <input type="checkbox" className="w-5 h-5" id="remmeber-me" />
                            <span className="font-serif">Remember Me</span>
                        </label>

                        {/* <Link className="font-serif underline text-text-muted" href={"/signup"}>
                            Create Account
                        </Link> */}
                    </div>

                    <button className="w-full py-3 bg-primary-500 cursor-pointer text-white font-serif font-semibold active:bg-primary-600" onClick={async () => login(form.email, form.password)}>Login</button>

                    <div className="flex gap-2 w-full items-center">
                        <hr className="bg-gray-500 h-0.5 w-full" />
                        <span className="font-semibold text-sm text-gray-500 text-nowrap">OR CONTINUE WITH</span>
                        <hr className="bg-gray-500 h-0.5 w-full" />
                    </div>

                    <button className="w-full flex items-center justify-center opacity-40 gap-2 py-3 bg-transparent border border-gray-400 cursor-pointer text-white font-serif font-semibold active:opacity-100" >
                        <img src="./google.png" width={30} height={30} />
                        <span className="text-black">Google</span>
                    </button>

                    <span className="font-serif font-semibold text-text-muted flex justify-center items-center mt-5 gap-1">
                        Doesn't have an account?
                        <Link href={"/signup"} className="text-primary-500 hover:underline">Create Account</Link>
                    </span>
                </div>
            </div>
        </section>
    )
}