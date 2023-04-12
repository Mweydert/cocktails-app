import { CircularProgress, Input } from "@chakra-ui/react"
import { ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "../../../../utils/hooks/useDebounce";
import styles from "./Autocomplete.module.scss";


// TODO: index for common components

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
}

const Autocomplete = ({
    placeholder,
    noContentLabel,
    onSelect,
    onSearch,
    isLoading,
    options
}: AutocompleteProps) => {
    // TODO: Hide options on click away from options

    const [displayOptions, setDisplayOptions] = useState<boolean>(false);


    const [searchRawValue, setSearchRawValue] = useState<string>("");
    const searchValue = useDebounce<string>(searchRawValue, 300);
    const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
        setSearchRawValue(event.target.value);
    }
    useEffect(() => {
        if (searchValue) {
            setDisplayOptions(true);
        } else {
            setDisplayOptions(false);
            // TODO: clear options ?
        }
        onSearch(searchValue);
    }, [searchValue]);


    const handleClick = () => {
        setDisplayOptions(val => !val);
    }

    const handleSelectOption = (option: Option) => {
        onSelect(option);
    }

    return (
        <div className={styles.container}>
            <Input placeholder={placeholder} onChange={handleInputChange} onClick={handleClick} />
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