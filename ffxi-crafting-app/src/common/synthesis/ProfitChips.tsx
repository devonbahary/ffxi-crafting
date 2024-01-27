import { FC, useContext, useRef } from 'react';
import { useHover } from 'usehooks-ts';
import Box from '@mui/material/Box';
import Chip, { ChipProps } from '@mui/material/Chip';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Synthesis } from '../../interfaces';
import { ShoppingCartContext } from '../../shopping-cart/ShoppingCartProvider';
import { StackSize } from '../../enums';

type ProfitChipProps = Required<Pick<ChipProps, 'onClick'>> &
    Pick<ChipProps, 'disabled'> & {
        value: number;
        stackability: 'unit' | 'stack';
    };

type StyledChipProps = Pick<
    ChipProps,
    'color' | 'disabled' | 'label' | 'onClick' | 'variant'
>;

export const StyledChip: FC<StyledChipProps> = ({
    color = 'success',
    label,
    variant,
    ...rest
}) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const isHover = useHover(ref);

    return (
        <Chip
            ref={ref}
            color={color}
            label={isHover ? <ShoppingCartIcon /> : label}
            variant={variant ? variant : isHover ? 'filled' : 'outlined'}
            {...rest}
            sx={{ width: 120, cursor: 'pointer' }}
        />
    );
};

const ProfitChip: FC<ProfitChipProps> = ({
    disabled,
    value,
    onClick,
    stackability,
}) => {
    const label =
        (value >= 0 ? '+' : '') +
        value +
        (stackability === 'stack' ? ' stack' : ' unit');

    return (
        <StyledChip
            color={value >= 0 ? 'success' : 'error'}
            disabled={disabled}
            label={label}
            onClick={onClick}
            variant={disabled ? 'outlined' : undefined}
        />
    );
};

type ProfitChipsProps = {
    synthesis: Synthesis;
    highlightProfit?: 'unit' | 'stack' | 'both';
};

export const ProfitChips: FC<ProfitChipsProps> = ({
    synthesis,
    highlightProfit,
}) => {
    const { unitProfit, stackProfit } = synthesis;

    const { addToCart } = useContext(ShoppingCartContext);

    const onUnitProfitClick: ChipProps['onClick'] = (e) => {
        e.stopPropagation();
        addToCart({
            synthesis,
            asStack: false,
            quantity: synthesis.yield,
        });
    };

    const onStackProfitClick: ChipProps['onClick'] = (e) => {
        e.stopPropagation();
        addToCart({
            synthesis,
            asStack: true,
            quantity: 1,
        });
    };

    const isStackable =
        parseInt(synthesis.product.stackSize) !== parseInt(StackSize.One);

    return (
        <Box display="flex" gap={1}>
            <ProfitChip
                stackability="unit"
                value={unitProfit}
                disabled={highlightProfit === 'stack'}
                onClick={onUnitProfitClick}
            />
            {isStackable && (
                <ProfitChip
                    stackability="stack"
                    value={stackProfit}
                    disabled={highlightProfit === 'unit'}
                    onClick={onStackProfitClick}
                />
            )}
        </Box>
    );
};
