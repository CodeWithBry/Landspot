"use client";

import { useAuth } from "@/hooks/useAuth";
import { AlertCircle, WifiOff, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

type FormAuth = {
  userName: string,
  email: string,
  password: string,
  confirmPassword: string,
  role: "buyer" | "agent"
}

export default function Singup() {
  const { signup } = useAuth();
  const navigation = useRouter();
  const [failedToCreateAccount, setFailedToCreateAccount] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(false);
  const [isInitiallySubmitted, setIsInitiallySubmitted] = useState<boolean>(false);
  const [errorDesc, setErrorDesc] = useState<string>("");
  const [form, setForm] = useState<FormAuth>({
    userName: "", email: "", password: "", confirmPassword: "", role: "buyer"
  });

  function displayViolation(e: ChangeEvent<HTMLInputElement> | null, idx: number, checkInputs?: boolean): boolean {
    if (!isInitiallySubmitted && !checkInputs) return false;
    let errorOccured = false;
    const usernameViolation = document.querySelector("#username-violation");
    const emailViolation = document.querySelector("#email-violation")
    const passwordViolation = document.querySelector("#password-violation");
    const confirmPassViolation = document.querySelector("#confirm-password-violation");

    if (!usernameViolation || !passwordViolation || !confirmPassViolation || !emailViolation) return false;

    switch (idx) {
      case 1:
        if (e?.target.value.length == 0 || (form.userName.length == 0 && checkInputs)) {
          usernameViolation.innerHTML = "Don't leave this field blank!";
          errorOccured = true;
        } else if ((e && e?.target.value.length < 8) || (form.userName.length < 8 && checkInputs)) {
          usernameViolation.innerHTML = "The username must consist of 8 characters!";
          errorOccured = true;
        } else {
          usernameViolation.innerHTML = "";
        }
        break;
      case 2:
        if (e?.target.value.length == 0 || (form.email.length == 0 && checkInputs)) {
          emailViolation.innerHTML = "The email is required!";
          errorOccured = true;
        } else {
          emailViolation.innerHTML = "";
        }
        break;
      case 3:
        if (e?.target.value.length == 0 || (form.password.length == 0 && checkInputs)) {
          passwordViolation.innerHTML = "Don't leave this field blank!"
          errorOccured = true;
        } else if (e && e.target.value.length < 8 || (form.password.length < 8 && checkInputs)) {
          passwordViolation.innerHTML = "The password must consist of 8 characters and above!";
          errorOccured = true;
        } else {
          passwordViolation.innerHTML = ""
        }
        break;
      case 4:
        if (e?.target.value.length == 0 || (form.confirmPassword.length == 0 && checkInputs)) {
          confirmPassViolation.innerHTML = "Don't leave this field blank!"
        } else if (form.password != form.confirmPassword) {
          console.log(form.password, e?.target.value)
          confirmPassViolation.innerHTML = "Password not matched!";
          errorOccured = true;
        } else {
          confirmPassViolation.innerHTML = ""
        }
        break;
    }

    return errorOccured;
  }

  async function handleSubmit() {
    let errorOccured = false;
    setIsInitiallySubmitted(true);
    setLoadingAuth(true);
    // Check for possible input violations
    for (let i = 1; i < 5; i++) {
      errorOccured = displayViolation(null, i, true);
      if(errorOccured) break;
    }

    if(errorOccured) {
      setLoadingAuth(false);
      return;
    }

    try {
      const res = await signup(form.email, form.userName, form.password, form.role);
      setLoadingAuth(false);
      if (res?.includes("already used")) {
        setLoadingAuth(false);
        setFailedToCreateAccount(true);
        setErrorDesc(res);
      } else {
        navigation.push("/login");
      }
    } catch (error) {
      setLoadingAuth(false);
      setFailedToCreateAccount(true);
      if (error instanceof Error) {
        // Check for possible input violations
        for (let i = 1; i < 5; i++) {
          displayViolation(null, i, true);
        }
        setErrorDesc(error.message);
        throw error;
      }

    }
  }

  useEffect(() => {
    if (failedToCreateAccount) {
      console.log(failedToCreateAccount)
      const timer = setTimeout(() => setFailedToCreateAccount(false), 2000);

      return () => clearTimeout(timer);
    }
  }, [failedToCreateAccount])

  return (
    <section className="w-full h-dvh grid grid-cols-1 items-center relative">
      {/* error wrapper */}
      {(failedToCreateAccount || loadingAuth) && <div className="absolute z-2 w-full h-full top-0 left-0 bg-semi-transparent flex place-items-center justify-center">
        {
          loadingAuth ?
            <div className="border-5 border-accent-500 border-b-transparent w-12 h-12 bg-transparent animate-spin rounded-full" /> :
            failedToCreateAccount && <div className="flex flex-col justify-center place-items-center bg-red-100 p-5 gap-1 border-2 border-red-600 rounded-xl text-red-600">
              <div className="flex justify-center place-items-center w-16 h-16 rounded-full mb-3">
                {errorDesc.includes("Network") ? <WifiOff size={10} className="shrink-0 w-10 h-10" /> : <AlertCircle size={10} className="shrink-0 w-10 h-10" />}
              </div>
              <h1 className="text-red-600 text-md font-serif text-center" id="error-description">{errorDesc}</h1>
            </div>
        }
      </div>}

      {/* Contents */}
      <div className="w-full h-full overflow-hidden overflow-y-auto flex align-middle justify-center bg-transparent">
        <div className="w-fit h-fit flex flex-col gap-4 bg-[rgba(255,255,255,0.9)] px-7 py-5 ">
          <div className="flex-col flex gap-1 mb-5">
            <h1 className="font-bold text-3xl w-full text-left text-nowrap font-serif">Create an Account!</h1>
            <p className="font-serif text-text-muted">Please enter your account details.</p>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-black font-semibold font-serif">Username</span>
            <input
              className="border border-text-muted font-serif py-2 px-2 indent-3" placeholder="Juan Dela Cruz"
              type="text"
              value={form.userName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setForm(prev => ({ ...prev, userName: e.target.value }));
                displayViolation(e, 1);
              }} />
            <span id="username-violation" className="font-serif font-bold text-red-600 text-sm"></span>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-black font-sepmibold font-serif">Email</span>
            <input
              className="border border-text-muted font-serif py-2 px-2 indent-3"
              placeholder="ex. juandelacruz@example.com"
              type="email"
              value={form.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setForm(prev => ({ ...prev, email: e.target.value }));
                displayViolation(e, 2);
              }} />
            <span id="email-violation" className="font-serif font-bold text-red-600 text-sm"></span>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-black font-semibold font-serif">Password</span>
            <input
              className="border border-text-muted font-serif py-2 px-2 indent-3" placeholder="********"
              type="password"
              value={form.password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setForm(prev => ({ ...prev, password: e.target.value }))
                displayViolation(e, 3);
              }} />
            <span id="password-violation" className="font-serif font-bold text-red-600 text-sm"></span>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-black font-semibold font-serif">Confirm Password</span>
            <input
              className="border border-text-muted font-serif py-2 px-2 indent-3"
              placeholder="********"
              type="password"
              value={form.confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setForm(prev => ({ ...prev, confirmPassword: e.target.value }));
                displayViolation(e, 4)
              }} />
            <span id="confirm-password-violation" className="font-serif font-bold text-red-600 text-sm"></span>
          </label>
          <div className="flex justify-between w-full">
            <div className="rounded-2xl overflow-hidden w-full flex items-center gap-2">
              <button onClick={() => setForm(prev => ({ ...prev, role: "buyer" }))} className={`${form.role == "buyer" && "bg-primary-500 text-white"} w-full text-center cursor-pointer rounded-2xl py-3 px-5`}>User</button>
              <button onClick={() => setForm(prev => ({ ...prev, role: "agent" }))} className={`${form.role == "agent" && "bg-primary-500 text-white"} w-full text-center cursor-pointer rounded-2xl py-3 px-5`}>Agent</button>
            </div>
          </div>

          <button
            className="w-full py-3 bg-primary-500 cursor-pointer text-white font-serif font-semibold active:bg-primary-600"
            onClick={handleSubmit}>
            Create Account
          </button>

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