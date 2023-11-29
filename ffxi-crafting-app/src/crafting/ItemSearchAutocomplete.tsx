import React, {
    FC,
    SyntheticEvent,
    useCallback,
    useEffect,
    useState,
} from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { debounce } from '@mui/material/utils';
import { Item } from '../interfaces';
import { GetItemsSearchParams, useGetItems } from '../hooks/use-items';

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

    const { loading: loadingGetItems, getItems } = useGetItems();

    const getItemsForSearchText = useCallback(
        debounce(async (name: string) => {
            const items = await getItems({
                name,
                ...getItemSearchParams,
            });
            setItems(items);
        }, 250),
        []
    );

    const onInputChange = (e: SyntheticEvent, val: string) => {
        setSearchText(val);
    };

    useEffect(() => {
        getItemsForSearchText(searchText);
    }, [getItemsForSearchText, searchText]);

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
