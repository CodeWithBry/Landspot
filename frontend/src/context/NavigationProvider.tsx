'use client'
import { NavigationContextType } from "@/types/NavigationContextType";
import { usePathname } from "next/navigation";
import { createContext, ReactNode, useEffect, useState } from "react";

export const navContext = createContext<NavigationContextType | null>(null);
export function NavigationProvider ({children}: {children: ReactNode}) {
    const path = usePathname();
    const [showMenu, setShowMenu] = useState<boolean>(true);
    
    useEffect(() => {
        if(path === "/") {
            setShowMenu(true);
        } else if(path === '/login' || path === "/signup") {
            setShowMenu(false);
        }
    }, [path])

    return <navContext.Provider value={{showMenu, setShowMenu, path}}>
        {children}
    </navContext.Provider>
}
