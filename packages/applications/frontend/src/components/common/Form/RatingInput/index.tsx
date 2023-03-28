import { useEffect, useState } from "react";
import { StarIcon } from "@chakra-ui/icons";
import styles from "./RatingInput.module.scss";

interface RatingInputParams {
    defaultRate?: number;
    onRate: (rate: number) => void;
    maxRating?: number;
}

const RatingInput = ({
    defaultRate,
    onRate,
    maxRating = 5,
}: RatingInputParams) => {
    const [rate, setRate] = useState<number>(defaultRate || 0);

    useEffect(() => {
        if (defaultRate) {
            setRate(defaultRate);
        }
    }, [defaultRate])

    const handleClick = (index: number) => {
        const newRate = index + 1;
        setRate(newRate);
        onRate(newRate);
    };

    return (
        <div>
            {Array.from(Array(maxRating)).map((_, index) => {
                const isChecked = rate > index;
                return (
                    <button
                        type="button"
                        className={styles.button}
                        onClick={() => handleClick(index)}
                    >
                        <StarIcon
                            boxSize={10}
                            color={isChecked ? "#ECC94B" : "gray"}
                        />
                    </button>
                );
            })}
        </div>
    )
}

export default RatingInput;