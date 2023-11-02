import { NextFunction, Request } from 'express';

export const getLimitAndOffset = (
    req: Request
): { limit?: number; offset?: number } => {
    const { limit, offset } = req.query;

    return {
        limit: limit ? parseInt(limit.toString()) : undefined,
        offset: offset ? parseInt(offset.toString()) : undefined,
    };
};

export const withErrorHandling = async (
    next: NextFunction,
    callback: () => Promise<void>
) => {
    try {
        await callback();
    } catch (err) {
        next(err);
    }
};
