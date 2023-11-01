import React, { FC, useState, useEffect } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2';
import { ItemSearchInput } from './ItemSearchInput';
import { Item } from '../types';
import Input from '@mui/material/Input/Input';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { AddSynthesisIngredient } from './crafting.types';
import TextField from '@mui/material/TextField';

type AddSynthesisIngredientFormProps = {
    onChange: (synthesisIngredient: AddSynthesisIngredient) => void;
    onDelete: () => void;
};

export const AddSynthesisIngredientForm: FC<
    AddSynthesisIngredientFormProps
> = ({ onChange, onDelete }) => {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [quantity, setQuantity] = useState(1);

    const onQuantityChange = (event) => {
        const quantity = parseInt(event.target.value);

        if (quantity) {
            setQuantity(quantity);
        }
    };

    useEffect(() => {
        onChange({
            item_id: selectedItem?.id,
            quantity,
        });
    }, [selectedItem, quantity]);

    return (
        <Grid2 container spacing={2}>
            <Grid2 xs={8}>
                <ItemSearchInput
                    label="Ingredient"
                    onChange={(item) => setSelectedItem(item)}
                />
            </Grid2>
            <Grid2
                xs={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <TextField
                    type="number"
                    label="Quantity"
                    onChange={onQuantityChange}
                    value={quantity}
                />
            </Grid2>
            <Grid2
                xs={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Button startIcon={<DeleteIcon />} onClick={onDelete} />
            </Grid2>
        </Grid2>
    );
};
