import { type NextFunction, type Request } from 'express';

interface LimitAndOffset {
    limit?: number;
    offset?: number;
}

interface Sort<T> {
    field: keyof T;
    direction: 'ASC' | 'DESC';
}

export const getLimitAndOffset = (req: Request): LimitAndOffset => {
    const { limit, offset } = req.query;

    if (limit !== undefined && typeof limit !== 'string') {
        throw new Error(
            `Unexpected non-string value in query for limit: ${JSON.stringify(
                limit
            )}`
        );
    }

    if (offset !== undefined && typeof offset !== 'string') {
        throw new Error(
            `Unexpected non-string value in query for offset: ${JSON.stringify(
                offset
            )}`
        );
    }

    if (limit !== undefined && isNaN(parseInt(limit))) {
        throw new Error(
            `Cannot interpret limit ${JSON.stringify(limit)} as a number`
        );
    }

    if (offset !== undefined && isNaN(parseInt(offset))) {
        throw new Error(
            `Cannot interpret offset ${JSON.stringify(offset)} as a number`
        );
    }

    return {
        limit: limit !== undefined ? parseInt(limit) : undefined,
        offset: offset !== undefined ? parseInt(offset) : undefined,
    };
};

export const getSort = <T>(
    req: Request,
    sortFields: Array<keyof T>
): Sort<T> | null => {
    const { sort } = req.query;

    if (sort === undefined) {
        return null;
    }

    if (typeof sort !== 'string') {
        throw new Error(
            `Expected string value for sort: ${JSON.stringify(sort)}`
        );
    }

    const [field, direction] = sort.split(':');

    if (!sortFields.includes(field as keyof T)) {
        throw new Error(`Cannot sort on field ${field}`);
    }

    return {
        field: field as keyof T,
        direction: direction === 'DESC' ? direction : 'ASC',
    };
};

export const getArray = <T>(val: any): T[] => {
    if (Array.isArray(val)) {
        return val;
    }
    if (val !== undefined) {
        return [val];
    }
    return [];
};

export const withErrorHandling = async (
    next: NextFunction,
    callback: () => Promise<void>
): Promise<void> => {
    try {
        await callback();
    } catch (err) {
        console.error(err);
        next(err);
    }
};
