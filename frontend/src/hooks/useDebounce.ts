import { Dispatch, SetStateAction, useEffect, useState } from "react"

export function useDebounce(): [string, string, Dispatch<SetStateAction<string>>] {
    const [val, setVal] = useState<string>("");
    const [debounceValue, setDebounceValue] = useState<string>("");
    useEffect(() => {
        const time = setTimeout(() => {
            setVal(debounceValue)
        }, 1000);

        return () => clearTimeout(time);
    }, [debounceValue]);

    return [val, debounceValue, setDebounceValue]
}