import Box from '@mui/material/Box';
import React, { FC } from 'react';

type SpaceProps = {
    d?: number;
};

export const Spacer: FC<SpaceProps> = ({ d = 2 }) => {
    return <Box marginTop={d} marginBottom={d} />;
};
