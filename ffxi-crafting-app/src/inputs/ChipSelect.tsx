import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

type Option<T> = {
    value: T;
    label: string;
};

type ChipSelectProps<T> = {
    multi?: boolean;
    onChange: (values: T | T[] | null) => void;
    options: Option<T>[];
};

export const ChipSelect = <T,>({
    multi = false,
    onChange,
    options,
}: ChipSelectProps<T>) => {
    const [multiSelectionSet, setMultiSelectionSet] = useState<Set<T>>(
        new Set()
    );
    const [singleSelection, setSingleSelection] = useState<T | null>(null);

    const onSelect = (value: T) => {
        if (multi) {
            setMultiSelectionSet((prev) => {
                const updated = new Set(prev);

                if (updated.has(value)) {
                    updated.delete(value);
                } else {
                    updated.add(value);
                }

                return updated;
            });
        } else {
            setSingleSelection((prev) => (prev !== value ? value : null));
        }
    };

    const isSelected = (value: T) => {
        return multi ? multiSelectionSet.has(value) : singleSelection === value;
    };

    useEffect(() => {
        if (multi) {
            onChange([...multiSelectionSet]);
        } else {
            onChange(singleSelection);
        }
    }, [multi, multiSelectionSet, singleSelection, onChange]);

    useEffect(() => {
        setMultiSelectionSet(new Set());
        setSingleSelection(null);
    }, [multi]);

    return (
        <Box display="flex" justifyContent="space-around" width="100%">
            {options.map(({ label, value }) => (
                <Chip
                    key={label}
                    label={label}
                    color={isSelected(value) ? 'primary' : 'default'}
                    onClick={() => onSelect(value)}
                />
            ))}
        </Box>
    );
};
