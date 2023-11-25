import React, {
    FC,
    SyntheticEvent,
    useCallback,
    useEffect,
    useState,
} from 'react';
import { v4 as uuid } from 'uuid';
import { useNavigate, useParams } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { NavigateButton } from './NavigateButton';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Item, SynthesisIngredient } from '../interfaces';
import { GetItemsSearchParams, useItems } from '../auction-house/use-items';
import { CRAFT_OPTIONS } from '../inputs/input-options';
import { Category, Craft } from '../enums';
import { NumberInput } from '../inputs/NumberInput';
import { ChipSelect } from '../inputs/ChipSelect';
import { useSynthesis } from './use-synthesis';
import { debounce } from '@mui/material/utils';
import { type Synthesis as SynthesisI } from '../interfaces';

type Nullable<T> = T | null;

type NullableRecord<T extends {}> = {
    [key in keyof T]: Nullable<T[key]>;
};

type NonNullableRecord<T extends {}> = {
    [key in keyof T]: NonNullable<T[key]>;
};

type FormSynthesisIngredient = NullableRecord<SynthesisIngredient> &
    Pick<SynthesisIngredient, 'id'>;

type ItemSearchInputProps = {
    label: string;
    onChange: (item: Item | null) => void;
    getItemSearchParams?: Pick<
        GetItemsSearchParams,
        'categories' | 'excludeCategory'
    >;
    value: Item | null;
};

const ItemSearchInput: FC<ItemSearchInputProps> = ({
    getItemSearchParams = {},
    label,
    onChange,
    value,
}) => {
    const [items, setItems] = useState<Item[]>([]);
    const [searchText, setSearchText] = useState('');

    const { getItems, loadingGetItems } = useItems();

    const getItemsForSearchText = useCallback(
        debounce(async (name: string) => {
            const items = await getItems({
                name,
                ...getItemSearchParams,
            });
            setItems(items);
        }, 250),
        []
    );

    const onInputChange = (e: SyntheticEvent, val: string) => {
        setSearchText(val);
    };

    useEffect(() => {
        getItemsForSearchText(searchText);
    }, [getItemsForSearchText, searchText]);

    return (
        <Autocomplete
            options={items}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loadingGetItems ? (
                                    <CircularProgress size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            getOptionLabel={(item) => item.name}
            filterOptions={(x) => x}
            inputValue={searchText}
            onChange={(e, val) => onChange(val)}
            onInputChange={onInputChange}
            loading={loadingGetItems}
            loadingText="Loading items..."
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={value}
        />
    );
};

type Crafting = {
    id: number | string;
    craft: Craft | null;
    craftLevel: number | null;
};

type CraftAndCraftLevelInputsProps = {
    onChange: (craft: Crafting) => void;
    value: Crafting;
};

const CraftAndCraftLevelInputs: FC<CraftAndCraftLevelInputsProps> = ({
    onChange,
    value,
}) => {
    return (
        <Stack direction="row" gap={2}>
            <NumberInput
                label="Craft Level"
                onChange={(e) => {
                    const craftLevel = parseInt(e.target.value);

                    if (craftLevel > 0) {
                        onChange({
                            ...value,
                            craftLevel: parseInt(e.target.value),
                        });
                    }
                }}
                value={value.craftLevel ?? ''}
            />
            <Box display="flex" alignItems="center" flex={1}>
                <ChipSelect
                    onChange={(val) => {
                        if (!Array.isArray(val)) {
                            onChange({
                                ...value,
                                craft: val,
                            });
                        }
                    }}
                    options={CRAFT_OPTIONS}
                    value={value.craft}
                />
            </Box>
        </Stack>
    );
};

type SynthesisIngredientInputsProps = {
    onChange: (ingredient: FormSynthesisIngredient) => void;
    value: FormSynthesisIngredient;
};

const SynthesisIngredientInputs: FC<SynthesisIngredientInputsProps> = ({
    onChange,
    value,
}) => {
    return (
        <Stack direction="row" gap={2}>
            <NumberInput
                label="Quantity"
                onChange={(e) => {
                    const quantity = parseInt(e.target.value);

                    if (quantity > 0) {
                        onChange({
                            ...value,
                            quantity,
                        });
                    }
                }}
                value={value.quantity ?? ''}
            />
            <Box width={'100%'}>
                <ItemSearchInput
                    label="Ingredient"
                    onChange={(item) => {
                        onChange({
                            ...value,
                            item,
                        });
                    }}
                    getItemSearchParams={{
                        excludeCategory: Category.Crystals,
                    }}
                    value={value.item}
                />
            </Box>
        </Stack>
    );
};

const areAllSubCraftsComplete = (
    subCrafts: Crafting[]
): subCrafts is NonNullableRecord<Crafting>[] => {
    return subCrafts.every((subCraft) => subCraft.craft && subCraft.craftLevel);
};

const areAllIngredientsComplete = (
    ingredients: FormSynthesisIngredient[]
): ingredients is NonNullableRecord<FormSynthesisIngredient>[] => {
    return ingredients.every(
        (ingredient) => ingredient.item && ingredient.quantity
    );
};

type SynthesisFormProps = {
    synthesis?: SynthesisI;
};

const SynthesisForm: FC<SynthesisFormProps> = ({ synthesis }) => {
    const [synthYield, setYield] = useState<number | null>(
        synthesis?.yield || null
    );
    const [productItem, setProductItem] = useState<Item | null>(
        synthesis?.product || null
    );
    const [crystal, setCrystal] = useState<Item | null>(
        synthesis?.crystal || null
    );
    const [craft, setCraft] = useState<Craft | null>(synthesis?.craft || null);
    const [craftLevel, setCraftLevel] = useState<number | null>(
        synthesis?.craftLevel || null
    );
    const [subCrafts, setSubCrafts] = useState<Crafting[]>(
        synthesis?.subCrafts || []
    );
    const [ingredients, setIngredients] = useState<FormSynthesisIngredient[]>(
        synthesis?.ingredients || []
    );

    const { createSynthesis, loadingCreateSynthesis, updateSynthesis } =
        useSynthesis();

    const navigate = useNavigate();

    const onSubmit = async () => {
        if (
            synthYield &&
            productItem &&
            crystal &&
            craft &&
            craftLevel &&
            areAllSubCraftsComplete(subCrafts) &&
            areAllIngredientsComplete(ingredients) &&
            !loadingCreateSynthesis
        ) {
            const input = {
                synthesis: {
                    yield: synthYield,
                    itemId: productItem.id,
                    crystalItemId: crystal.id,
                    craft,
                    craftLevel,
                },
                subCrafts,
                ingredients: ingredients.map((ingredient) => ({
                    itemId: ingredient.item.id,
                    quantity: ingredient.quantity,
                })),
            };

            if (synthesis) {
                await updateSynthesis(synthesis.id, input);
            } else {
                await createSynthesis(input);
            }

            navigate(-1);
        }
    };

    const onAddSubCraft = () => {
        setSubCrafts((prev) => [
            ...prev,
            { id: uuid(), craft: null, craftLevel: null },
        ]);
    };

    const onChangeSubCraft = (subCraft: Crafting) => {
        setSubCrafts((prev) =>
            prev.map((prevSubCraft) => {
                return prevSubCraft.id === subCraft.id
                    ? subCraft
                    : prevSubCraft;
            })
        );
    };

    const onDeleteSubCraft = (id: string | number) => {
        setSubCrafts((prevSubCrafts) =>
            prevSubCrafts.filter((prevSub) => prevSub.id !== id)
        );
    };

    const onAddIngredient = () => {
        setIngredients((prev) => [
            ...prev,
            { id: uuid(), item: null, quantity: null },
        ]);
    };

    const onChangeIngredient = (ingredient: FormSynthesisIngredient) => {
        setIngredients((prev) =>
            prev.map((prevIngredient) => {
                return prevIngredient.id === ingredient.id
                    ? ingredient
                    : prevIngredient;
            })
        );
    };

    const onDeleteIngredient = (id: string | number) => {
        setIngredients((prevIngredients) =>
            prevIngredients.filter((prevIngredient) => prevIngredient.id !== id)
        );
    };

    const allSubCraftsComplete = areAllSubCraftsComplete(subCrafts);
    const allIngredientsComplete = areAllIngredientsComplete(ingredients);

    const isFormComplete =
        synthYield &&
        productItem &&
        crystal &&
        craft &&
        craftLevel &&
        allSubCraftsComplete &&
        ingredients.length > 0 &&
        allIngredientsComplete;

    return (
        <Stack gap={2}>
            <Typography variant="overline">New Synthesis</Typography>
            <Stack gap={2} direction="row">
                <NumberInput
                    label="Yield"
                    onChange={(e) => {
                        const synthYield = parseInt(e.target.value);

                        if (synthYield > 0) {
                            setYield(synthYield);
                        }
                    }}
                    value={synthYield ?? ''}
                />
                <Box width="100%">
                    <ItemSearchInput
                        label="Product"
                        onChange={setProductItem}
                        getItemSearchParams={{
                            excludeCategory: Category.Crystals,
                        }}
                        value={productItem}
                    />
                </Box>
            </Stack>
            {productItem && (
                <ItemSearchInput
                    label="Crystal"
                    onChange={setCrystal}
                    getItemSearchParams={{
                        categories: [Category.Crystals, Category.Alchemy],
                    }}
                    value={crystal}
                />
            )}
            {crystal && (
                <CraftAndCraftLevelInputs
                    onChange={({ craft, craftLevel }) => {
                        setCraft(craft);
                        setCraftLevel(craftLevel);
                    }}
                    value={{
                        id: '',
                        craft,
                        craftLevel,
                    }}
                />
            )}
            {craft && craftLevel && (
                <>
                    <Divider />
                    <Typography
                        variant="overline"
                        color={subCrafts.length ? 'default' : 'text.secondary'}
                    >
                        SubCrafts
                    </Typography>
                    <Box>
                        <Stack gap={2} marginBottom={2}>
                            {subCrafts.map((subCraft) => (
                                <Box key={subCraft.id} display="flex" gap={2}>
                                    <IconButton
                                        sx={{ width: 60 }}
                                        onClick={() =>
                                            onDeleteSubCraft(subCraft.id)
                                        }
                                    >
                                        <RemoveCircleIcon color="error" />
                                    </IconButton>
                                    <Box flex="1 0 auto">
                                        <CraftAndCraftLevelInputs
                                            value={subCraft}
                                            onChange={onChangeSubCraft}
                                        />
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                        <Button
                            variant="outlined"
                            onClick={onAddSubCraft}
                            startIcon={<AddIcon />}
                            disabled={!allSubCraftsComplete}
                        >
                            Add SubCraft
                        </Button>
                    </Box>
                </>
            )}
            {craft && craftLevel && (
                <>
                    <Divider />
                    <Typography variant="overline">
                        Synthesis Ingredients
                    </Typography>
                    <Box>
                        <Stack gap={2} marginBottom={2}>
                            {ingredients.map((ingredient) => (
                                <Box key={ingredient.id} display="flex" gap={2}>
                                    <IconButton
                                        sx={{ width: 60 }}
                                        onClick={() =>
                                            onDeleteIngredient(ingredient.id)
                                        }
                                    >
                                        <RemoveCircleIcon color="error" />
                                    </IconButton>
                                    <Box flex="1 0 auto">
                                        <SynthesisIngredientInputs
                                            onChange={onChangeIngredient}
                                            value={ingredient}
                                        />
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                        <Button
                            variant="outlined"
                            onClick={onAddIngredient}
                            startIcon={<AddIcon />}
                            disabled={!allIngredientsComplete}
                        >
                            Add Ingredient
                        </Button>
                    </Box>
                </>
            )}
            {Boolean(ingredients.length) && (
                <>
                    <Divider />
                    <Box>
                        <Button
                            startIcon={<SaveIcon />}
                            variant="contained"
                            disabled={
                                !isFormComplete && !loadingCreateSynthesis
                            }
                            onClick={onSubmit}
                        >
                            {loadingCreateSynthesis ? 'Saving...' : 'Save'}
                        </Button>
                    </Box>
                </>
            )}
        </Stack>
    );
};

export const Synthesis = () => {
    const [synthesis, setSynthesis] = useState<SynthesisI | null>(null);

    const { getSynthesis } = useSynthesis();

    const { id } = useParams();

    useEffect(() => {
        (async () => {
            if (id) {
                const synthesis = await getSynthesis(id);
                setSynthesis(synthesis);
            }
        })();
    }, [id, getSynthesis]);

    return (
        <>
            <NavigateButton startIcon={<ArrowBackIcon />} navigateTo={-1}>
                Back
            </NavigateButton>
            {id ? (
                synthesis ? (
                    <SynthesisForm synthesis={synthesis} />
                ) : (
                    <Box>
                        <CircularProgress />
                    </Box>
                )
            ) : (
                <SynthesisForm />
            )}
        </>
    );
};
