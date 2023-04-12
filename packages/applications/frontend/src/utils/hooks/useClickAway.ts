import { useEffect, useRef } from "react";

export const useClickAway = (
    onClickAway: () => void
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ref = useRef<any>(null);

    const handleClick = (e: MouseEvent) => {
        if (!ref?.current?.contains(e.target)) {
            onClickAway();
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, [handleClick]);

    return { ref };
}
