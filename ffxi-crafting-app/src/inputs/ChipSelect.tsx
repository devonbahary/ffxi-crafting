import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

type Option<T> = {
    value: T;
    label: string;
};

type Options<T> = {
    options: Option<T>[];
};

type BaseChipSelectProps<T> = Options<T> & {
    onSelect: (val: T) => void;
    isSelected: (val: T) => boolean;
};

type ChipSelectProps<T> = Options<T> & {
    onChange: (values: T | null) => void;
    value: T | null;
};

type MultiChipSelectProps<T> = Options<T> & {
    onChange: (values: Set<T>) => void;
    value: Set<T>;
};

const BaseChipSelect = <T,>({
    options,
    isSelected,
    onSelect,
}: BaseChipSelectProps<T>) => {
    return (
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
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

export const ChipSelect = <T,>({
    onChange,
    options,
    value,
}: ChipSelectProps<T>) => {
    const onSelect = (newValue: T) => {
        onChange(newValue !== value ? newValue : null);
    };

    const isSelected = (optionValue: T) => {
        return value === optionValue;
    };

    return (
        <BaseChipSelect
            options={options}
            onSelect={onSelect}
            isSelected={isSelected}
        />
    );
};

export const MultiChipSelect = <T,>({
    onChange,
    options,
    value,
}: MultiChipSelectProps<T>) => {
    const onSelect = (selection: T) => {
        const updated = new Set(value);

        if (updated.has(selection)) {
            updated.delete(selection);
        } else {
            updated.add(selection);
        }

        onChange(updated);
    };

    const isSelected = (selection: T) => {
        return value.has(selection);
    };

    return (
        <BaseChipSelect
            options={options}
            isSelected={isSelected}
            onSelect={onSelect}
        />
    );
};
