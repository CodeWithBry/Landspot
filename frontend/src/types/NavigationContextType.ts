import { Dispatch, SetStateAction } from "react"

export type NavigationContextType = {
    showMenu: boolean,
    setShowMenu: Dispatch<SetStateAction<boolean>>,
    path: string
}