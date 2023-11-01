import debounce from 'lodash.debounce';
import React, { FC, useMemo, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { UseAutocompleteProps } from '@mui/material/useAutocomplete';
import { getItems } from '../api';
import { Item } from '../types';
import TextField from '@mui/material/TextField';

type ItemSearchInputProps = {
    onChange: (item: Item | null) => void;
    label: string;
};

export const ItemSearchInput: FC<ItemSearchInputProps> = ({
    label,
    onChange,
}) => {
    const [options, setOptions] = useState([]);

    const eventHandler: UseAutocompleteProps<
        any,
        false,
        false,
        false
    >['onInputChange'] = async (event, value, reason) => {
        // the event uses `prop` and `value`
        const items = await getItems({ name: value });
        setOptions(items);
    };

    const debouncedEventHandler = useMemo(
        () => debounce(eventHandler, 300),
        []
    );

    return (
        <Autocomplete
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, val) => option.id === val.id}
            options={options}
            onChange={(event, item) => onChange(item)}
            onInputChange={debouncedEventHandler}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    InputProps={{
                        ...params.InputProps,
                        type: 'search',
                    }}
                />
            )}
        />
    );
};
