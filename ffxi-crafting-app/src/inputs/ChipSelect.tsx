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
    value: T | T[];
};

export const ChipSelect = <T,>({
    multi = false,
    onChange,
    options,
    value,
}: ChipSelectProps<T>) => {
    const [multiSelectionSet, setMultiSelectionSet] = useState<Set<T>>(
        new Set(Array.isArray(value) ? [...value] : [value])
    );
    const [singleSelection, setSingleSelection] = useState<T | null>(
        Array.isArray(value) ? null : value
    );

    const onSelect = (value: T) => {
        if (multi) {
            setMultiSelectionSet((prev) => {
                const updated = new Set(prev);

                if (updated.has(value)) {
                    updated.delete(value);
                } else {
                    updated.add(value);
                }

                onChange(Array.from(updated));

                return updated;
            });
        } else {
            setSingleSelection((prev) => {
                const newVal = prev !== value ? value : null;
                onChange(newVal);
                return newVal;
            });
        }
    };

    useEffect(() => {
        if (multi) {
            setMultiSelectionSet(
                new Set(Array.isArray(value) ? [...value] : [value])
            );
        } else {
            setSingleSelection(Array.isArray(value) ? null : value);
        }
    }, [multi, value]);

    const isSelected = (value: T) => {
        return multi ? multiSelectionSet.has(value) : singleSelection === value;
    };

    return (
        <Box display="flex" gap={2}>
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
