'use client'
import { api } from "@/lib/api";
import { AuthContextType, LoginType, LogoutType, SignupType, User } from "@/types/AuthContextType";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loadingAuthentication, setLoadingAuthentication] = useState<boolean>(false);
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

    const signup: SignupType = async (email: string, name: string, password: string, role: "buyer" | "agent") => {
        setLoadingAuthentication(true);
        try {
            // if (password != confirmPassword) return setLoadingAuthentication(false);
            console.log({ email, name, password, role })
            const result = await api.post('/api/auth/register', { email, name, password, role });
            setToken(result.data.token);
            setLoadingAuthentication(false);
        } catch (error) {
            setLoadingAuthentication(false);
            throw error;
        } finally {
            router.push('/login');
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
            console.log(error)
            throw error;
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

    return <AuthContext.Provider value={{ user, isDataLoaded, signup, login, logout }}>
        {children}
    </AuthContext.Provider>
}
