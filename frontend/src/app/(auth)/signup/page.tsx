"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { ChangeEvent, useRef, useState } from "react";

export default function Singup() {
  const { signup } = useAuth();
  const checkRef = useRef(null);
  const [form, setForm] = useState<{ userName: string, email: string, password: string, role: "buyer" | "agent" }>({
    userName: "", email: "", password: "", role: "buyer"
  });

  return (
    <section className="w-full h-fit py-10 grid grid-cols-1 items-center place-items-center relative">
      {/* <div className="w-full h-full flex items-center justify-center absolute z-1">
        <div className="w-[90%] h-[90%] shadow-md rounded-2xl overflow-hidden flex">
          <LeafletMap center={[14.5995, 120.9842]} />
        </div>
      </div> */}
      <div className="w-50% h-full flex items-center align-middle justify-center bg-transparent z-2">
        <div className="w-fit h-fit flex flex-col gap-4 bg-[rgba(255,255,255,0.9)] px-7 py-5 ">
          <div className="flex-col flex gap-1 mb-5">
            <h1 className="font-bold text-3xl w-full text-left text-nowrap font-serif">Create an Account!</h1>
            <p className="font-serif text-text-muted">Please enter your account details.</p>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-black font-semibold font-serif">Username</span>
            <input className="border border-text-muted font-serif py-2 px-2 indent-3" placeholder="Juan Dela Cruz" type="text" value={form.userName} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, userName: e.target.value }))} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-black font-semibold font-serif">Email</span>
            <input className="border border-text-muted font-serif py-2 px-2 indent-3" placeholder="ex. juandelacruz@example.com" type="email" value={form.email} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, email: e.target.value }))} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-black font-semibold font-serif">Password</span>
            <input className="border border-text-muted font-serif py-2 px-2 indent-3" placeholder="********" type="password" value={form.password} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, password: e.target.value }))} />
          </label>

          <div className="flex justify-between w-full">
            <div className="rounded-2xl overflow-hidden w-full flex items-center gap-2">
              <button onClick={() => setForm(prev => ({...prev, role: "buyer"}))}className={`${form.role == "buyer" && "bg-primary-500 text-white"} w-full text-center cursor-pointer rounded-2xl py-3 px-5`}>User</button>
              <button onClick={() => setForm(prev => ({...prev, role: "agent"}))}className={`${form.role == "agent" && "bg-primary-500 text-white"} w-full text-center cursor-pointer rounded-2xl py-3 px-5`}>Agent</button>
            </div>
          </div>

          <button className="w-full py-3 bg-primary-500 cursor-pointer text-white font-serif font-semibold active:bg-primary-600" onClick={async () => signup(form.email, form.userName, form.password, form.role)}>Create Account</button>

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
            Already have an account?
            <Link href={"/login"} className="text-primary-500 hover:underline">Login</Link>
          </span>
        </div>
      </div>
    </section>
  )
}