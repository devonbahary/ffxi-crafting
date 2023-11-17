import {
    type NextFunction,
    type Request,
    type Response,
    Router,
} from 'express';
import { validationResult } from 'express-validator';
import { getLimitAndOffset, withErrorHandling } from './utilities';
import {
    createItemCategoryValidator,
    createItemNameValidator,
    createItemStackSizeValidator,
} from '../validators';
import { Item } from '../models/Item';

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

router.get('/', (req, res, next): void => {
    // eslint-disable-next-line
    withErrorHandling(next, async () => {
        const { limit, offset } = getLimitAndOffset(req);
        const items = await Item.findAll({
            limit,
            offset,
        });
        res.json(items);
    });
});

router.post(
    '/',
    createValidationRules,
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // eslint-disable-next-line
        withErrorHandling(next, async () => {
            const item = await Item.create(req.body);
            res.send(item.toJSON());
        });
    }
);

router.put(
    '/:id',
    updateValidationRules,
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = parseInt(req.params.id);

        // eslint-disable-next-line
        withErrorHandling(next, async () => {
            const item = await Item.findOne({
                where: { id },
            });

            if (item === null) {
                res.sendStatus(404);
                return;
            }

            await Item.update(
                {
                    id,
                    ...req.body,
                },
                {
                    where: { id },
                }
            );

            const updatedItem = await Item.findOne({
                where: { id },
            });

            res.send(updatedItem);
        });
    }
);

router.delete('/:id', (req, res, next) => {
    const { id } = req.params;

    // eslint-disable-next-line
    withErrorHandling(next, async () => {
        const item = await Item.findOne({
            where: { id },
        });

        if (item === null) {
            res.sendStatus(404);
            return;
        }

        await Item.destroy({ where: { id } });

        res.sendStatus(200);
    });
});

export default router;
