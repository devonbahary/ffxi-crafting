import React, { FC } from 'react';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';

type HighlightableIconButtonProps = IconButtonProps & {
    Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
        muiName: string;
    };
};

export const HighlightableIconButton: FC<HighlightableIconButtonProps> = ({
    Icon,
    ...rest
}) => {
    return (
        <IconButton sx={{ ':hover svg': { color: 'inherit' } }} {...rest}>
            <Icon color="disabled" />
        </IconButton>
    );
};
