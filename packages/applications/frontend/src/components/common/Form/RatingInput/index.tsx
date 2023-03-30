import { useEffect, useState } from "react";
import { StarIcon } from "@chakra-ui/icons";
import styles from "./RatingInput.module.scss";

export enum RatingInputSize {
    SMALL = "sm",
    MEDIUM = "md",
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

    const handleClick = (newRate: number) => {
        if (!disabled) {
            setRate(newRate);
            onRate(newRate);
        }
    };


    return (
        <div className={styles.container}>
            {Array.from(Array(maxRating)).map((_, index) => {
                const leftStarChecked = rate > index;
                const rightStarChecked = rate > index + 0.5;
                return (
                    <div className={`${styles["full-star"]} ${styles[size]}`}>
                        <button
                            type="button"
                            className={`${styles.button} ${styles[size]}`}
                            onClick={() => handleClick(index + 0.5)}
                            disabled={disabled}
                        >
                            <StarIcon
                                boxSize={getIconSize(size)}
                                color={leftStarChecked ? "#ECC94B" : "gray"}
                            />
                        </button>
                        <button
                            type="button"
                            className={`${styles.button} ${styles.right} ${styles[size]}`}
                            onClick={() => handleClick(index + 1)}
                            disabled={disabled}
                        >
                            <StarIcon
                                boxSize={getIconSize(size)}
                                color={rightStarChecked ? "#ECC94B" : "gray"}
                            />
                        </button>
                    </div>
                );
            })}
        </div>
    )
}

export default RatingInput;