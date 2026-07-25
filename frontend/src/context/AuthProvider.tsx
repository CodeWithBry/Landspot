'use client'
import { api } from "@/lib/api";
import { AuthContextType, LoginType, SignupType, User } from "@/types/AuthContextType";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loadingAuthentication, setLoadingAuthentication] = useState<boolean>(false);
    const [failedToAuthenticate, setFailedToAuthenticate] = useState<boolean>(false);
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);


    // FUNCTIONS 
    const getToken = () =>
        typeof window !== 'undefined' ? localStorage.getItem('token') : null

    const setToken = (token: string) => {
        localStorage.setItem("token", token);
    }

    const deleteToken = () => {
        localStorage.removeItem("token");
    }

    const signup: SignupType = async (email: string, name: string, password: string, role: "buyer" | "agent"): Promise<string | undefined> => {
        setLoadingAuthentication(true);
        try {
            // if (password != confirmPassword) return setLoadingAuthentication(false);
            const result = await api.post('/api/auth/register', { email, name, password, role });
            setToken(result.data.token);
            setLoadingAuthentication(false);
            return result.data.data.mess;
        } catch (error) {
            setLoadingAuthentication(false);
            throw error;
        } 
    }

    const login: LoginType = async (email: string, password: string) => {
        setLoadingAuthentication(true);
        try {
            const { data } = await api.post('/api/auth/login', { email, password });
            setToken(data.data.token);
            setUser(data.data.user);
            router.push('/');
        } catch (error) {
            setFailedToAuthenticate(true);
            throw error;
        } finally {
            setLoadingAuthentication(false);
        }
    }

    const logout = async () => {
        try {
            setUser(null);
            deleteToken();
            router.push('/login')
        } catch (error) {
            throw error;
        }
    }

    useEffect(() => {
        const tokenKey = localStorage.getItem('token');

        if (tokenKey) {
            api.get('/api/auth/get-user')
                .then(res => {
                    setUser(res.data.data)
                })
                .catch((e) => console.log(e))
                .finally(() => {
                    setLoadingAuthentication(false)
                    setIsDataLoaded(true)
                })
        }
        setIsDataLoaded(true)
    }, [])

    return <AuthContext.Provider value={{ loadingAuthentication, failedToAuthenticate, setFailedToAuthenticate, user, isDataLoaded, signup, login, logout }}>
        {children}
    </AuthContext.Provider>
}
