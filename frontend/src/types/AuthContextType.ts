import { Dispatch, SetStateAction } from "react";

export type User = {
    user_name: string,
    email: string,
    role: "buyer" | "agent",
    created_at: Date,
    id: string
}

export type SignupType = (email: string, name: string, password: string, role: "buyer" | "agent",) => Promise<string | undefined>;
export type LoginType = (email: string, password: string) => void;
export type LogoutType = () => void; 
export type GetProfileType = () => Promise<ProfileType | null | undefined>
export type UpdateProfilePicture = (file: File, profile_id: string) => Promise<string | undefined>  
export type UpdateProfile = (profile: ProfileType) => void;

export type AuthContextType = {
    loadingAuthentication: boolean,
    failedToAuthenticate: boolean,
    setFailedToAuthenticate: Dispatch<SetStateAction<boolean>>,
    user: User | null,
    profile: ProfileType | null,
    isDataLoaded: boolean,
    signup: SignupType,
    login: LoginType,
    logout: LogoutType,
    getProfile: GetProfileType,
    updateProfilePicture: UpdateProfilePicture,
    updateProfile: UpdateProfile
}

export type ProfileType = {
    user_id: string;
    profile_id: string;
    role: string;
    email: string;
    user_name: string;
    first_name: string;
    last_name: string;
    photo_url: string;
    phone_number: string;
    bio: string;
    facebook_acc: string;
}