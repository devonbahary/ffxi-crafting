import { formatDistanceToNow } from 'date-fns';
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
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Item } from '../interfaces';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { CATEGORY_OPTIONS, STACK_SIZE_OPTIONS } from '../inputs/input-options';
import {
    useCreateItem,
    useDeleteItem,
    useGetItems,
    useUpdateItem,
} from '../hooks/use-items';
import { CategoryFilters } from './CategoryFilters';
import { Category } from '../enums';

const large: Pick<GridColDef, 'flex'> = { flex: 2 };
const small: Pick<GridColDef, 'flex'> = { flex: 1 };
const editable: Pick<GridColDef, 'editable'> = { editable: true };

const isNewRow = (row: any): boolean => typeof row.id === 'string';

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
            field: 'unitPrice',
            headerName: 'Unit Price',
            ...small,
            ...editable,
        },
        {
            field: 'stackPrice',
            headerName: 'Stack Price',
            ...small,
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
            field: 'updatedAt',
            headerName: 'Last Updated',
            ...large,
            valueGetter: ({ value }) => {
                if (!value) return '';
                const date = new Date(value);
                return `${formatDistanceToNow(date)} ago`;
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

    useEffect(() => {
        (async () => {
            try {
                const items = await getItems({
                    categories: Array.from(categoryFilterSet),
                });
                setItems(items);
            } catch (err) {
                setItems([]);
            }
        })();
    }, [getItems, categoryFilterSet]);

    return (
        <>
            <Button
                startIcon={<AddIcon />}
                onClick={handleAddItem}
                variant="outlined"
                sx={{ marginBottom: 2 }}
            >
                Add Item
            </Button>
            <Box marginBottom={2}>
                <Typography variant="overline">Filters</Typography>
                <CategoryFilters onChange={setCategoryFilterSet} />
            </Box>
            <DataGrid
                editMode={editMode}
                rows={items}
                columns={columns}
                processRowUpdate={processRowUpdate}
                rowModesModel={rowModesModel}
                onRowModesModelChange={setRowModesModel}
                loading={loadingGetItems || loadingCreateItem}
            />
            <DeleteConfirmationModal
                pendingDeleteItem={pendingDeleteItem}
                onClose={() => setPendingDeleteId(null)}
                onConfirm={() => deleteRow()}
                loadingDeleteItem={loadingDeleteItem}
            />
        </>
    );
};
