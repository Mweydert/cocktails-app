import { useState, useEffect } from "react"

/**
 * 
 * @param value Value to debounce
 * @param time in milliSeconds 
 * @returns 
 */
export const useDebounce = <T>(
    value: T,
    time: number
) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, time);

        return () => {
            clearTimeout(handler);
        };
    }, [value, time]);

    return debouncedValue;
};