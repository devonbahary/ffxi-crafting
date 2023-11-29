import React, { FC, useCallback, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { debounce } from '@mui/material/utils';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

type DebouncedSearchInputProps = {
    onChange: (value: string) => void;
};

const DEBOUNCE = 250;

export const DebouncedSearchInput: FC<DebouncedSearchInputProps> = ({
    onChange,
}) => {
    const [searchText, setSearchText] = useState('');

    const setSearchTextDebounced = useCallback(debounce(onChange, DEBOUNCE), [
        onChange,
    ]);

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
                setSearchTextDebounced(value);
                setSearchText(value);
            }}
            value={searchText}
        />
    );
};
