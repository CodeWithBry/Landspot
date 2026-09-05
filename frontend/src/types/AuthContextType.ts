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
export type GetUsersType = (last_item: ProfileType | null, follower_profile_id: string | null, signal: AbortSignal) => Promise<ProfileType[] | undefined>
export type GetProfileType = () => Promise<ProfileType | null | undefined>
export type UpdateProfilePicture = (file: File, profile_id: string) => Promise<string | undefined>  
export type UpdateProfile = (profile: ProfileType) => void;
export type FollowType = (follower_id: string, followed_id: string) => Promise<string | undefined>;
export type UnFollowType = (follower_id: string, followed_id: string) => Promise<string | undefined>;

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
    updateProfile: UpdateProfile,
    getUsers: GetUsersType,
    follow: FollowType,
    unFollow: UnFollowType

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
    followers?: number;
    facebook_acc?: string;
    instagram_acc?: string,
    linkedin_acc?: string,
    website_link?: string,
    followed?: boolean
}