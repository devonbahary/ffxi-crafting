import React, { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { Item } from '../interfaces';
import { GetItemsSearchParams, useGetItems } from '../hooks/useItems';
import { DEBOUNCE_VALUE } from '../common/constants';

type ItemSearchAutocompleteProps = {
    label: string;
    onChange: (item: Item | null) => void;
    getItemSearchParams?: Pick<
        GetItemsSearchParams,
        'categories' | 'excludeCategory'
    >;
    value: Item | null;
};

export const ItemSearchAutocomplete: FC<ItemSearchAutocompleteProps> = ({
    getItemSearchParams = {},
    label,
    onChange,
    value,
}) => {
    const [items, setItems] = useState<Item[]>([]);
    const [searchText, setSearchText] = useState('');
    const debouncedSearchText = useDebounce<string>(searchText, DEBOUNCE_VALUE);

    const { loading: loadingGetItems, getItems } = useGetItems();

    const onInputChange = (e: SyntheticEvent, val: string) => {
        setSearchText(val);
    };

    useEffect(() => {
        (async () => {
            const { items } = await getItems({
                name: debouncedSearchText,
                ...getItemSearchParams,
                limit: 25,
                offset: 0,
            });
            setItems(items);
        })();
    }, [debouncedSearchText, getItems, getItemSearchParams]);

    return (
        <Autocomplete
            options={items}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loadingGetItems ? (
                                    <CircularProgress size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            getOptionLabel={(item) => item.name}
            filterOptions={(x) => x}
            inputValue={searchText}
            onChange={(e, val) => onChange(val)}
            onInputChange={onInputChange}
            loading={loadingGetItems}
            loadingText="Loading items..."
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={value}
        />
    );
};
