import { type NextFunction, type Request } from 'express';

interface LimitAndOffset {
    limit?: number;
    offset?: number;
}

export const getLimitAndOffset = (req: Request): LimitAndOffset => {
    const { limit, offset } = req.query;

    return {
        limit:
            Array.isArray(limit) && Boolean(limit)
                ? parseInt(limit.toString())
                : undefined,
        offset:
            Array.isArray(offset) && Boolean(offset)
                ? parseInt(offset.toString())
                : undefined,
    };
};

export const withErrorHandling = async (
    next: NextFunction,
    callback: () => Promise<void>
): Promise<void> => {
    try {
        await callback();
    } catch (err) {
        next(err);
    }
};
