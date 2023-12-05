import React, { FC, useEffect, useRef } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';

type NumberInputProps = Pick<TextFieldProps, 'label' | 'value' | 'onChange'>;

export const NumberInput: FC<NumberInputProps> = (props) => {
    const textFieldRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => e.preventDefault();

        const { current } = textFieldRef;

        if (current) current.addEventListener('wheel', handleWheel);

        return () => {
            if (current) current.removeEventListener('wheel', handleWheel);
        };
    }, [textFieldRef]);

    return (
        <TextField
            type="number"
            {...props}
            ref={textFieldRef}
            InputProps={{ endAdornment: null }}
        />
    );
};
