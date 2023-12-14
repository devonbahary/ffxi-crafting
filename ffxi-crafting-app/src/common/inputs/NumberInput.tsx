import React, { FC, useEffect, useRef } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';

type NumberInputProps = Pick<TextFieldProps, 'label' | 'value' | 'onChange'> & {
    condensed?: boolean;
};

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

    const { condensed, ...rest } = props;

    return (
        <TextField
            type="number"
            {...rest}
            ref={textFieldRef}
            InputProps={{ endAdornment: null }}
            sx={{
                maxWidth: condensed ? 72 : undefined,
            }}
        />
    );
};
