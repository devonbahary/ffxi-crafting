import React, { FC } from 'react'
import Grid2 from '@mui/material/Unstable_Grid2'
import { Navigation } from './Navigation'

type AppContainerProps = {
    children: React.ReactNode
}

export const AppContainer: FC<AppContainerProps> = ({ children }) => {
    return (
        <Grid2 container>
            <Grid2 xs={2}>
                <Navigation />
            </Grid2>
            <Grid2 xs={10}>{children}</Grid2>
        </Grid2>
    )
}
