import { CircularProgress, Input } from "@chakra-ui/react"
import { ChangeEvent, useEffect, useState } from "react";
import {
    useClickAway,
    useDebounce
} from "../../../../utils/hooks";
import styles from "./Autocomplete.module.scss";

interface Option {
    key: string;
    label: string;
    isSelected?: boolean;
}

interface AutocompleteProps {
    placeholder?: string;
    noContentLabel?: string;
    options: Option[];
    isLoading?: boolean;
    onSearch: (value: string) => void;
    onSelect: (item: Option) => void;
    onEnterSearch?: (value: string) => void;
    clearAtSelect?: boolean;
}

const Autocomplete = ({
    placeholder,
    noContentLabel,
    onSelect,
    onSearch,
    onEnterSearch,
    isLoading,
    options,
    clearAtSelect
}: AutocompleteProps) => {
    const [displayOptions, setDisplayOptions] = useState<boolean>(false);
    const { ref } = useClickAway(() => {
        if (displayOptions) {
            setDisplayOptions(false);
        }
    });

    const [searchRawValue, setSearchRawValue] = useState<string>("");
    const searchValue = useDebounce<string>(searchRawValue, 300);
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchRawValue(event.target.value);
    }
    useEffect(() => {
        if (searchValue) {
            setDisplayOptions(true);
        } else {
            setDisplayOptions(false);
        }
        onSearch(searchValue);
    }, [searchValue]);


    const handleToggleOptions = () => {
        setDisplayOptions(val => !val);
    }

    const handleSelectOption = (option: Option) => {
        if (clearAtSelect) {
            setSearchRawValue("");
            setDisplayOptions(false);
        } else if (options.length === 1) {
            setDisplayOptions(false);
        }
        onSelect(option);
    }

    const handleEnterSearch = () => {
        if (onEnterSearch) {
            onEnterSearch(searchRawValue);
        }
    }

    return (
        <div className={styles.container} ref={ref}>
            <Input
                value={searchRawValue}
                placeholder={placeholder}
                onChange={handleInputChange}
                onClick={handleToggleOptions}
                onKeyUp={(e) => {
                    if (e.key === "Enter") {
                        handleEnterSearch();
                    }
                }}
            />
            {displayOptions && searchValue !== "" && (
                <div className={styles["options-container"]}>
                    {isLoading ? (
                        <div className={styles["loader-container"]}>
                            <CircularProgress isIndeterminate size="40px" />
                        </div>
                    ) : (
                        <>
                            {options?.length <= 0 ? (
                                <div className={styles["no-options-container"]}>
                                    <p>{noContentLabel}</p>
                                </div>
                            ) : (
                                <>
                                    {options.map(option => !option.isSelected && (
                                        <div
                                            key={option.key}
                                            onClick={() => handleSelectOption(option)}
                                            className={styles.option}
                                        >
                                            <span>{option.label}</span>
                                        </div>
                                    ))}
                                </>     
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Autocomplete;