import { Dispatch, SetStateAction } from "react"

export type NavigationContextType = {
    showMenu: boolean,
    setShowMenu: Dispatch<SetStateAction<boolean>>,
    unseenMailsLength: number,
    setUnseenMailsLength: Dispatch<SetStateAction<number>>,
    path: string
}