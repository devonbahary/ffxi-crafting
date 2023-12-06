import React, { FC, useEffect, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { DEBOUNCE_VALUE } from '../common/constants';

type DebouncedSearchInputProps = {
    onChange: (value: string) => void;
};

export const DebouncedSearchInput: FC<DebouncedSearchInputProps> = ({
    onChange,
}) => {
    const [searchText, setSearchText] = useState('');
    const debouncedSearchText = useDebounce<string>(searchText, DEBOUNCE_VALUE);

    useEffect(() => {
        onChange(debouncedSearchText);
    }, [debouncedSearchText, onChange]);

    return (
        <TextField
            label="Search"
            InputProps={{
                startAdornment: <SearchIcon />,
                endAdornment: (
                    <IconButton
                        onClick={() => {
                            // clear immediately, no debounce
                            onChange('');
                            setSearchText('');
                        }}
                        disabled={!searchText}
                    >
                        <ClearIcon />
                    </IconButton>
                ),
            }}
            fullWidth
            onChange={({ target: { value } }) => {
                setSearchText(value);
            }}
            value={searchText}
        />
    );
};
