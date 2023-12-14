import {
    Duration,
    formatDistanceToNow,
    isAfter,
    isBefore,
    sub,
} from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import {
    DataGrid,
    DataGridProps,
    GridActionsCellItem,
    GridColDef,
    GridRowModes,
    GridRowModesModel,
    GridRowParams,
} from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InsightsIcon from '@mui/icons-material/Insights';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { Item } from '../interfaces';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';
import {
    CATEGORY_OPTIONS,
    STACK_SIZE_OPTIONS,
} from '../common/inputs/input-options';
import {
    useCreateItem,
    useDeleteItem,
    useGetItems,
    useUpdateItem,
} from '../hooks/use-items';
import { CategoryFilters } from './CategoryFilters';
import { Category, StackSize } from '../enums';
import { ViewTitle } from '../ViewTitle';
import { DebouncedSearchInput } from './DebouncedSearchInput';
import { useTheme } from '@mui/material';

enum StaleThreshold {
    Fresh = 'Fresh',
    Stale = 'Stale',
    Outdated = 'Outdated',
}

const large: Pick<GridColDef, 'flex'> = { flex: 2 };
const small: Pick<GridColDef, 'flex'> = { flex: 1 };
const editable: Pick<GridColDef, 'editable'> = { editable: true };

const isNewRow = (row: any): boolean => typeof row.id === 'string';

const SUBTITLE = (
    <>
        The <InsightsIcon fontSize="small" /> Insights view is only as accurate
        as the prices of the Items here at the{' '}
        <StorefrontIcon fontSize="small" /> Auction House, so the key labor of
        this application is to update Item prices so that Synthesis profits are
        a reflection of the most up-to-date economics. Maybe one day the
        HorizonXI server will expose a public API to query Item prices and this
        effort will become unnecessary. 😉
        <br />
        <br />
        Stackability:
        <br />
        Items are sold at the in-game Auction House only as a single or as a
        stack; that is the basis for Synthesis profitability being measured in
        those two dimensions.
    </>
);

export const AuctionHouse = () => {
    const [items, setItems] = useState<Partial<Item>[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [editMode, setEditMode] = useState<DataGridProps['editMode']>('cell');
    const [pendingDeleteId, setPendingDeleteId] = useState<
        string | number | null
    >(null);

    const [categoryFilterSet, setCategoryFilterSet] = useState<Set<Category>>(
        new Set()
    );

    const [searchText, setSearchText] = useState('');

    const { loading: loadingGetItems, getItems } = useGetItems();
    const { loading: loadingCreateItem, createItem } = useCreateItem();
    const { updateItem } = useUpdateItem();
    const { loading: loadingDeleteItem, deleteItem } = useDeleteItem();

    const handleAddItem = () => {
        const id = randomId();

        const newItem = {
            id,
            category: '',
            stackSize: '',
        };

        setItems((prevItems) => [newItem as Item, ...prevItems]);

        setRowModesModel((prevModel) => ({
            ...prevModel,
            [id]: {
                mode: GridRowModes.Edit,
                fieldToFocus: 'name',
            },
        }));

        setEditMode('row');
    };

    const processRowUpdate: DataGridProps['processRowUpdate'] = async (
        updatedRow,
        oldRow
    ) => {
        if (updatedRow.stackSize === parseInt(StackSize.One)) {
            updatedRow.stackPrice = null;
        } else if (updatedRow.stackPrice === null) {
            updatedRow.stackPrice = updatedRow.unitPrice;
        }

        if (isNewRow(updatedRow)) {
            const oldId = updatedRow.id;

            const createdItem = await createItem(updatedRow);

            setItems((prevItems) =>
                prevItems.map((item) => {
                    if (item.id === oldId) {
                        // replace with database-given record
                        return createdItem;
                    }
                    return item;
                })
            );

            return createdItem;
        } else {
            try {
                const updatedItem = await updateItem(updatedRow.id, updatedRow);
                return updatedItem;
            } catch (err) {
                return oldRow;
            }
        }
    };

    const handleDelete = (params: GridRowParams) => {
        if (isNewRow(params.row)) {
            setItems((prevItems) =>
                prevItems.filter((item) => item.id !== params.id)
            );
        }
        setPendingDeleteId(params.id);
    };

    const handleCloseDeleteModal = () => {
        if (!loadingDeleteItem) setPendingDeleteId(null);
    };

    const deleteRow = async () => {
        if (pendingDeleteId === null) return;

        try {
            await deleteItem(pendingDeleteId);

            setPendingDeleteId(null);

            setItems((prevItems) =>
                prevItems.filter((item) => item.id !== pendingDeleteId)
            );
        } catch (err) {}
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', ...large, ...editable },
        {
            field: 'category',
            headerName: 'Category',
            type: 'singleSelect',
            valueOptions: CATEGORY_OPTIONS,
            ...large,
            ...editable,
        },
        {
            field: 'stackSize',
            headerName: 'Stack Size',
            type: 'singleSelect',
            valueOptions: STACK_SIZE_OPTIONS,
            ...small,
            ...editable,
        },
        {
            field: 'unitPrice',
            headerName: 'Unit Price',
            ...small,
            ...editable,
            valueGetter: ({ value }) => {
                if (typeof value === 'number') {
                    return value.toLocaleString();
                }
                return value;
            },
        },
        {
            field: 'stackPrice',
            headerName: 'Stack Price',
            ...small,
            ...editable,
            valueGetter: ({ value }) => {
                if (typeof value === 'number') {
                    return value.toLocaleString();
                }
                return value;
            },
        },
        {
            field: 'updatedAt',
            headerName: 'Last Updated',
            ...large,
            valueGetter: ({ value }) => {
                if (!value) return '';
                const date = new Date(value);
                return `${formatDistanceToNow(date)} ago`;
            },
            cellClassName: ({ row: { updatedAt } }) => {
                const now = new Date();
                const twentyFourHoursAgo = sub(now, { days: 1 });
                const oneWeekAgo = sub(now, { weeks: 1 });
                const cellValue = new Date(updatedAt);

                if (isAfter(cellValue, twentyFourHoursAgo))
                    return StaleThreshold.Fresh;
                else if (isAfter(cellValue, oneWeekAgo))
                    return StaleThreshold.Stale;
                return StaleThreshold.Outdated;
            },
        },
        {
            field: 'actions',
            type: 'actions',
            getActions: (params: GridRowParams) => [
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    onClick={() => handleDelete(params)}
                    label="Delete"
                />,
            ],
        },
    ];

    const pendingDeleteItem = useMemo(() => {
        return items.find((i) => i.id === pendingDeleteId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingDeleteId]);

    const theme = useTheme();

    useEffect(() => {
        (async () => {
            try {
                const items = await getItems({
                    name: searchText,
                    categories: Array.from(categoryFilterSet),
                });
                setItems(items);
            } catch (err) {
                setItems([]);
            }
        })();
    }, [getItems, categoryFilterSet, searchText]);

    return (
        <>
            <ViewTitle
                Icon={StorefrontIcon}
                title="Auction House"
                subtitle={SUBTITLE}
            />
            <Box marginBottom={2}>
                <Typography variant="overline">Filters</Typography>
                <Stack gap={2}>
                    <CategoryFilters onChange={setCategoryFilterSet} />
                    <DebouncedSearchInput onChange={setSearchText} />
                </Stack>
            </Box>
            <Button
                startIcon={<AddIcon />}
                onClick={handleAddItem}
                variant="outlined"
                sx={{ marginBottom: 2 }}
            >
                Add Item
            </Button>
            <DataGrid
                editMode={editMode}
                rows={items}
                columns={columns}
                processRowUpdate={processRowUpdate}
                rowModesModel={rowModesModel}
                onRowModesModelChange={setRowModesModel}
                loading={loadingGetItems || loadingCreateItem}
                isCellEditable={(params) => {
                    if (params.field === 'stackPrice') {
                        return params.row.stackSize !== parseInt(StackSize.One);
                    }
                    return params.colDef.editable !== undefined
                        ? params.colDef.editable
                        : true;
                }}
                autoHeight
                sx={{
                    [`& .MuiDataGrid-cell.${StaleThreshold.Fresh}`]: {
                        color: theme.palette.success.main,
                    },
                    [`& .MuiDataGrid-cell.${StaleThreshold.Stale}`]: {
                        color: theme.palette.warning.main,
                    },
                    [`& .MuiDataGrid-cell.${StaleThreshold.Outdated}`]: {
                        color: theme.palette.error.main,
                    },
                }}
            />
            <DeleteConfirmationModal
                pendingDeleteItem={pendingDeleteItem}
                onClose={handleCloseDeleteModal}
                onConfirm={() => deleteRow()}
                loading={loadingDeleteItem}
            />
        </>
    );
};
