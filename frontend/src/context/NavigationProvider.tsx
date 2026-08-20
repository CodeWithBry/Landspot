'use client'
import { NavigationContextType } from "@/types/NavigationContextType";
import { usePathname } from "next/navigation";
import { createContext, ReactNode, useEffect, useState } from "react";

export const navContext = createContext<NavigationContextType | null>(null);
export function NavigationProvider ({children}: {children: ReactNode}) {
    const path = usePathname();
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [unseenMailsLength, setUnseenMailsLength] = useState<number>(0);

    return <navContext.Provider value={{showMenu, setShowMenu, unseenMailsLength, setUnseenMailsLength, path}}>
        {children}
    </navContext.Provider>
}
