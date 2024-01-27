import React, { ReactElement } from 'react';
import Grid from '@mui/material/Grid';

type GridLayoutProps<T extends { id: string | number }> = {
    iterable: T[];
    renderItem: (t: T) => ReactElement;
};

export const GridLayout = <T extends { id: string | number }>({
    iterable,
    renderItem,
}: GridLayoutProps<T>) => {
    return (
        <Grid container spacing={2}>
            {iterable.map((element) => (
                <Grid key={element.id} item sm={12} lg={6}>
                    {renderItem(element)}
                </Grid>
            ))}
        </Grid>
    );
};
