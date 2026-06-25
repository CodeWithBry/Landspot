"use client";
import React, { useEffect, useState } from 'react'

type Props = {
    fn: () => void;
}

function SwitchButton({ fn }: Props) {
    const [isToggled, setIsToggled] = useState<boolean>(false);

    useEffect(() => {
        if (isToggled) fn();
    }, [isToggled]);

    return (
        <label
            className={`${isToggled ? "opacity-90 bg-accent-400" : "opacity-80 bg-gray-300"} w-8 h-fit relative px-px py-px rounded-xl   cursor-pointer`}
            htmlFor="switch">
            <input type="checkbox" id='switch' className='hidden' onChange={(e) => setIsToggled(e.target.checked)} />
            {/* finger */}
            <div className={`${isToggled ? "translate-x-[17px]" : "translate-x-0"} bg-white transition-transform duration-200 rounded-full shadow-md h-3.5 w-3.5`} />
        </label>
    )
}

export default SwitchButton