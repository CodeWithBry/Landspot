"use client"

import { RefObject, useCallback, useEffect, useState } from "react"

export function useClickOutside<T extends HTMLElement = HTMLElement>(ref: RefObject<T | null>, callback: () => void) {
    const [element, setElement] = useState<RefObject<T | null>>(ref);
    const callBack = useCallback(() => callback(), []); 

    useEffect(() => {
        function handleClickOutside(event: MouseEvent | TouchEvent) {
            if (element.current && !element.current.contains(event.target as Node)) {
                callBack();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [element, callback])
}