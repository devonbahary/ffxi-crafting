import React, { FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { CRAFT_OPTIONS } from '../inputs/input-options';
import { Craft } from '../enums';

type CraftChipSelectProps = {
    multi?: boolean;
    onChange: (values: Craft | Craft[] | null) => void;
};

export const CraftChipSelect: FC<CraftChipSelectProps> = ({
    multi = false,
    onChange,
}) => {
    const [multiSelectionSet, setMultiSelectionSet] = useState<Set<Craft>>(
        new Set()
    );
    const [singleSelection, setSingleSelection] = useState<Craft | null>(null);

    const onSelect = (value: Craft) => {
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

    const isSelected = (value: Craft) => {
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
            {CRAFT_OPTIONS.map(({ label, value }) => (
                <Chip
                    key={value}
                    label={label}
                    color={isSelected(value) ? 'primary' : 'default'}
                    onClick={() => onSelect(value)}
                />
            ))}
        </Box>
    );
};
