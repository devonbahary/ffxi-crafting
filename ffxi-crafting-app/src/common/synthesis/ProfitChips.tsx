import { FC, useContext, useEffect, useRef, useState } from 'react';
import Chip, { ChipProps } from '@mui/material/Chip';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Synthesis } from '../../interfaces';
import Box from '@mui/material/Box';
import { ShoppingCartContext } from '../../shopping-cart/ShoppingCartProvider';
import { StackSize } from '../../enums';

type ProfitChipProps = Required<Pick<ChipProps, 'onClick'>> &
    Pick<ChipProps, 'disabled'> & {
        value: number;
        stackability: 'unit' | 'stack';
    };

const ProfitChip: FC<ProfitChipProps> = ({
    disabled,
    value,
    onClick,
    stackability,
}) => {
    const [hover, setHover] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onMouseEnter = () => {
            setHover(true);
        };

        const onMouseLeave = () => {
            setHover(false);
        };

        if (ref.current) {
            ref.current.addEventListener('mouseenter', onMouseEnter);

            ref.current.addEventListener('mouseleave', onMouseLeave);
        }

        return () => {
            if (ref.current) {
                ref.current.removeEventListener('mouseenter', onMouseEnter);
                ref.current.removeEventListener('mouseleave', onMouseLeave);
            }
        };
    }, []);

    const label =
        (value >= 0 ? '+' : '') +
        value +
        (stackability === 'stack' ? ' stack' : ' unit');

    return (
        <Chip
            label={hover ? <ShoppingCartIcon /> : label}
            color={value >= 0 ? 'success' : 'error'}
            variant={disabled ? 'outlined' : hover ? 'filled' : 'outlined'}
            disabled={disabled}
            onClick={onClick}
            ref={(input) => {
                ref.current = input;
            }}
            sx={{ width: 120 }}
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
