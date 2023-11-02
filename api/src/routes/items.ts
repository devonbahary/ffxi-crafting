import { NextFunction, Request, Response, Router } from 'express';
import { validationResult } from 'express-validator';
import { ItemsRepository } from '../repositories/ItemsRepository';
import { getLimitAndOffset, withErrorHandling } from './utilities';
import {
    createItemCategoryValidator,
    createItemNameValidator,
    createItemStackSizeValidator,
} from '../validators';

const createValidationRules = [
    createItemNameValidator(),
    createItemCategoryValidator(),
    createItemStackSizeValidator(),
];

const updateValidationRules = [
    createItemNameValidator().optional(),
    createItemCategoryValidator().optional(),
    createItemStackSizeValidator(),
];

const router = Router();

router.get('/', async (req, res, next) => {
    withErrorHandling(next, async () => {
        const { limit, offset } = getLimitAndOffset(req);
        const items = await ItemsRepository.findAll(limit, offset);
        res.json(items);
    });
});

router.post(
    '/',
    createValidationRules,
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        withErrorHandling(next, async () => {
            const item = await ItemsRepository.createOne(req.body);
            res.send(item.toJSON());
        });
    }
);

router.put(
    '/:id',
    updateValidationRules,
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = parseInt(req.params.id);

        withErrorHandling(next, async () => {
            const item = await ItemsRepository.findById(id);
            if (!item) {
                res.sendStatus(404);
                return;
            }

            const updatedItem = await ItemsRepository.updateOne({
                id,
                ...req.body,
            });

            res.send(updatedItem);
        });
    }
);

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    withErrorHandling(next, async () => {
        const item = await ItemsRepository.findById(id);
        if (!item) {
            res.sendStatus(404);
            return;
        }

        await ItemsRepository.deleteOne(id);

        res.sendStatus(200);
    });
});

export default router;
