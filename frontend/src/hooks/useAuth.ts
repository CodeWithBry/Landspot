import { AuthContext } from "@/context/AuthProvider"
import { AuthContextType } from "@/types/AuthContextType"
import { useContext } from "react"

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext) as AuthContextType;
    return ctx
}