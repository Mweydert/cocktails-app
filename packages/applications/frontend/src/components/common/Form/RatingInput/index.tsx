import { useEffect, useState } from "react";
import { StarIcon } from "@chakra-ui/icons";
import styles from "./RatingInput.module.scss";

export enum RatingInputSize {
    SMALL = "sm",
    MEDIUM = "md",
    // SMALL = 5,
    // MEDIUM = 10,
}

const getIconSize = (size: RatingInputSize): number => {
    switch(size) {
    case RatingInputSize.SMALL:
        return 5;
    case RatingInputSize.MEDIUM:
        return 10;
    default:
        return 10;

    }
}

interface RatingInputParams {
    defaultRate?: number;
    onRate: (rate: number) => void;
    maxRating?: number;
    disabled?: boolean;
    size?: RatingInputSize;
}

const RatingInput = ({
    defaultRate,
    onRate,
    maxRating = 5,
    disabled = false,
    size = RatingInputSize.MEDIUM,
}: RatingInputParams) => {
    const [rate, setRate] = useState<number>(defaultRate || 0);

    useEffect(() => {
        if (defaultRate) {
            setRate(defaultRate);
        }
    }, [defaultRate])

    const handleClick = (index: number) => {
        if (!disabled) {
            const newRate = index + 1;
            setRate(newRate);
            onRate(newRate);
        }
    };

    return (
        <div>
            {Array.from(Array(maxRating)).map((_, index) => {
                const isChecked = rate > index;
                return (
                    <button
                        type="button"
                        className={`${styles.button} ${styles[size]}`}
                        onClick={() => handleClick(index)}
                        disabled={disabled}
                    >
                        <StarIcon
                            boxSize={getIconSize(size)}
                            color={isChecked ? "#ECC94B" : "gray"}
                        />
                    </button>
                );
            })}
        </div>
    )
}

export default RatingInput;