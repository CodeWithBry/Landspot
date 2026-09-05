'use client'
import { api } from "@/lib/api";
import { AuthContextType, FollowType, GetUsersType, LoginType, ProfileType, SignupType, User } from "@/types/AuthContextType";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [loadingAuthentication, setLoadingAuthentication] = useState<boolean>(false);
    const [failedToAuthenticate, setFailedToAuthenticate] = useState<boolean>(false);
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);


    // FUNCTIONS 
    const getUsers: GetUsersType = async (last_item: ProfileType | null, follower_profile_id: string | null, signal: AbortSignal): Promise<ProfileType[] | undefined> => {
        try {
            const result = await api.post(`/api/auth/get-users`, { last_item, follower_profile_id }, { signal });
            if (result) return result.data.data;
        } catch (error) {
            console.log(error);
        }
    }

    const signup: SignupType = async (email: string, user_name: string, password: string, role: "buyer" | "agent"): Promise<string | undefined> => {
        setLoadingAuthentication(true);
        try {
            // if (password != confirmPassword) return setLoadingAuthentication(false);
            const result = await api.post('/api/auth/register', { email, user_name, password, role });
            setLoadingAuthentication(false);
            return result.data.data.mess;
        } catch (error) {
            setLoadingAuthentication(false);
        }
    }

    const login: LoginType = async (email: string, password: string) => {
        setLoadingAuthentication(true);
        try {
            const { data } = await api.post('/api/auth/login', { email, password });
            setUser(data.data.user);
            router.push('/');
        } catch (error) {
            setFailedToAuthenticate(true);
        } finally {
            setLoadingAuthentication(false);
        }
    }

    const logout = async () => {
        try {
            await api.get('/api/auth/logout');
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.log(error)
        }
    }

    const getProfile = async (): Promise<ProfileType | null | undefined> => {
        try {
            const result = await api.get(`/api/auth/get-profile`);
            const { data } = result.data;
            return data as ProfileType;
        } catch (error) {
            console.error(error);
        }
    };

    const updateProfilePicture = async (file: File, profile_id: string): Promise<string | undefined> => {
        try {
            const formData = new FormData();
            formData.append("image", file);
            const result = await api.post(`/api/cloudinary/upload-profile/${profile_id}`, formData, {
                headers: { "Content-Type": "singlepart/form-data" }
            });
            const { photo_url } = result.data.data as { photo_url: string };
            return photo_url;
        } catch (error) {
            console.log(error);
        }
    }

    const updateProfile = async (profile: ProfileType) => {
        try {
            await api.post(`/api/auth/update-profile`, { ...profile });
        } catch (error) {
            console.log(error);
        }
    }

    const follow: FollowType = async (follower_id: string, followed_id: string): Promise<string | undefined> => {
        try {
            const res = await api.post(`/api/auth/follow`, { follower_id, followed_id });
            return res.data.data
        } catch (error) {
            console.log(error);
        }
    }

    const unFollow: FollowType = async (follower_id: string, followed_id: string): Promise<string | undefined> => {
        console.log(follower_id, followed_id)
        try {
            const res = await api.post(`/api/auth/unfollow`, { follower_id, followed_id });
            return res.data.data
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        api.get('/api/auth/get-user', {
            withCredentials: true
        })
            .then(async (res) => {
                setUser(res.data.data);
                const result = await getProfile();
                if (result) setProfile(result);
            })
            .catch((e) => console.log(e))
            .finally(() => {
                setLoadingAuthentication(false)
                setIsDataLoaded(true)
            })
        setIsDataLoaded(true);
    }, [])

    return <AuthContext.Provider value={{ loadingAuthentication, failedToAuthenticate, setFailedToAuthenticate, user, profile, isDataLoaded, signup, login, logout, getUsers, getProfile, updateProfilePicture, updateProfile, follow, unFollow }}>
        {children}
    </AuthContext.Provider>
}
