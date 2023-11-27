import React, { FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TuneIcon from '@mui/icons-material/Tune';
import { MultiChipSelect } from '../inputs/ChipSelect';
import { CATEGORY_OPTIONS } from '../inputs/input-options';
import { Category } from '../enums';

type CategoryFiltersProps = {
    onChange: (categoryFilterSet: Set<Category>) => void;
};

enum MainCategory {
    Weapons = 'Weapons',
    Armor = 'Armor',
    Scrolls = 'Scrolls',
    Medicines = 'Medicines',
    Furnishings = 'Furnishings',
    Materials = 'Materials',
    Food = 'Food',
    Crystals = 'Crystals',
    Others = 'Others',
}

const MAIN_CATEGORY_OPTIONS = Object.values(MainCategory).map(
    (mainCategory) => ({
        label: mainCategory,
        value: mainCategory,
    })
);

const WEAPONS_OPTIONS = CATEGORY_OPTIONS.filter((option) =>
    option.value.includes('Weapon')
);

const ARMOR_OPTIONS = CATEGORY_OPTIONS.filter((option) =>
    option.value.includes('Armor')
);

const SCROLLS_OPTIONS = CATEGORY_OPTIONS.filter((option) =>
    option.value.includes('Scrolls')
);

const MATERIALS_OPTIONS = CATEGORY_OPTIONS.filter((option) =>
    option.value.includes('Materials')
);

const FOOD_OPTIONS = CATEGORY_OPTIONS.filter((option) =>
    option.value.includes('Food')
);

const OTHERS_OPTIONS = CATEGORY_OPTIONS.filter((option) =>
    option.value.includes('Others')
);

const SINGLE_MAIN_CATEGORIES = [
    MainCategory.Medicines,
    MainCategory.Crystals,
    MainCategory.Furnishings,
];

export const CategoryFilters: FC<CategoryFiltersProps> = ({ onChange }) => {
    const [openFilters, setOpenFilters] = useState(false);
    const [mainCategorySet, setMainCategorySet] = useState<Set<MainCategory>>(
        new Set()
    );
    const [weaponsSet, setWeaponsSet] = useState<Set<Category>>(new Set());
    const [armorSet, setArmorSet] = useState<Set<Category>>(new Set());
    const [scrollsSet, setScrollsSet] = useState<Set<Category>>(new Set());
    const [materialsSet, setMaterialsSet] = useState<Set<Category>>(new Set());
    const [foodSet, setFoodSet] = useState<Set<Category>>(new Set());
    const [othersSet, setOthersSet] = useState<Set<Category>>(new Set());
    // Medicines, Furnishings, Crystals
    const [singleCategorySet] = useState<Set<Category>>(new Set());

    const onClickPrimaryButton = () => {
        if (openFilters) {
            setMainCategorySet(new Set());
            setOpenFilters(false);
        } else {
            setOpenFilters(true);
        }
    };

    useEffect(() => {
        const clearMainCategoryCategories = () => {
            if (!mainCategorySet.has(MainCategory.Weapons)) {
                setWeaponsSet(new Set());
            }
            if (!mainCategorySet.has(MainCategory.Armor)) {
                setArmorSet(new Set());
            }
            if (!mainCategorySet.has(MainCategory.Scrolls)) {
                setScrollsSet(new Set());
            }
            if (!mainCategorySet.has(MainCategory.Materials)) {
                setMaterialsSet(new Set());
            }
            if (!mainCategorySet.has(MainCategory.Food)) {
                setFoodSet(new Set());
            }
            if (!mainCategorySet.has(MainCategory.Others)) {
                setOthersSet(new Set());
            }
        };

        clearMainCategoryCategories();
    }, [mainCategorySet]);

    useEffect(() => {
        const updated = new Set([
            ...weaponsSet,
            ...armorSet,
            ...scrollsSet,
            ...materialsSet,
            ...foodSet,
            ...othersSet,
            ...singleCategorySet,
        ]);

        for (const category of SINGLE_MAIN_CATEGORIES) {
            if (mainCategorySet.has(category)) {
                updated.add(category as unknown as Category);
            }
        }

        onChange(updated);
    }, [
        mainCategorySet,
        weaponsSet,
        armorSet,
        scrollsSet,
        materialsSet,
        foodSet,
        othersSet,
        singleCategorySet,
        onChange,
    ]);

    return (
        <Box>
            <Box display="flex" gap={2} marginBottom={1}>
                <Button
                    onClick={onClickPrimaryButton}
                    variant={openFilters ? 'contained' : 'outlined'}
                    startIcon={<TuneIcon />}
                >
                    {openFilters ? 'Reset' : 'Categories'}
                </Button>
                {openFilters && (
                    <MultiChipSelect
                        options={MAIN_CATEGORY_OPTIONS}
                        onChange={setMainCategorySet}
                        value={mainCategorySet}
                    />
                )}
            </Box>
            <Stack gap={1} paddingLeft={2} marginBottom={1}>
                {mainCategorySet.has(MainCategory.Weapons) && (
                    <Box>
                        <Typography variant="overline">Weapons</Typography>
                        <MultiChipSelect
                            onChange={(values) =>
                                setWeaponsSet(new Set(values))
                            }
                            options={WEAPONS_OPTIONS}
                            value={weaponsSet}
                        />
                    </Box>
                )}
                {mainCategorySet.has(MainCategory.Armor) && (
                    <Box>
                        <Typography variant="overline">Armor</Typography>
                        <MultiChipSelect
                            onChange={(values) => setArmorSet(new Set(values))}
                            options={ARMOR_OPTIONS}
                            value={armorSet}
                        />
                    </Box>
                )}
                {mainCategorySet.has(MainCategory.Scrolls) && (
                    <Box>
                        <Typography variant="overline">Scrolls</Typography>
                        <MultiChipSelect
                            onChange={(values) =>
                                setScrollsSet(new Set(values))
                            }
                            options={SCROLLS_OPTIONS}
                            value={scrollsSet}
                        />
                    </Box>
                )}
                {mainCategorySet.has(MainCategory.Materials) && (
                    <Box>
                        <Typography variant="overline">Materials</Typography>
                        <MultiChipSelect
                            onChange={(values) =>
                                setMaterialsSet(new Set(values))
                            }
                            options={MATERIALS_OPTIONS}
                            value={materialsSet}
                        />
                    </Box>
                )}
                {mainCategorySet.has(MainCategory.Food) && (
                    <Box>
                        <Typography variant="overline">Food</Typography>
                        <MultiChipSelect
                            onChange={(values) => setFoodSet(new Set(values))}
                            options={FOOD_OPTIONS}
                            value={foodSet}
                        />
                    </Box>
                )}
                {mainCategorySet.has(MainCategory.Others) && (
                    <Box>
                        <Typography variant="overline">Others</Typography>
                        <MultiChipSelect
                            onChange={(values) => setOthersSet(new Set(values))}
                            options={OTHERS_OPTIONS}
                            value={othersSet}
                        />
                    </Box>
                )}
            </Stack>
        </Box>
    );
};
