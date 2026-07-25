import { Dispatch, SetStateAction } from "react";

export type User = {
    name: string,
    email: string,
    role: "buyer" | "agent",
    created_at: Date,
    id: string
}

export type SignupType = (email: string, name: string, password: string, role: "buyer" | "agent",) => Promise<string | undefined> ;
export type LoginType = (email: string, password: string) => void;
export type LogoutType = () => void;

export type AuthContextType = {
    loadingAuthentication: boolean,
    failedToAuthenticate: boolean,
    setFailedToAuthenticate: Dispatch<SetStateAction<boolean>>,
    user: User | null,
    isDataLoaded: boolean,
    signup: SignupType,
    login: LoginType
    logout: LogoutType
}