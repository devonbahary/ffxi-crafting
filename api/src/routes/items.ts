import {
    type NextFunction,
    type Request,
    type Response,
    Router,
} from 'express';
import { validationResult } from 'express-validator';
import {
    getArray,
    getLimitAndOffset,
    getSort,
    withErrorHandling,
} from './utilities';
import {
    createItemCategoryValidator,
    createItemNameValidator,
    createItemStackSizeValidator,
} from '../validators';
import { type Attributes, Op, type WhereOptions } from 'sequelize';
import { Item } from '../models';

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

const itemSortFields: Array<keyof Attributes<Item>> = [
    'id',
    'name',
    'unitPrice',
    'stackPrice',
    'updatedAt',
];

const router = Router();

router.get('/', (req, res, next): void => {
    // eslint-disable-next-line
    withErrorHandling(next, async () => {
        const { limit, offset } = getLimitAndOffset(req);

        const { name, excludeCategory } = req.query;

        const sort = getSort<Attributes<Item>>(req, itemSortFields);

        const categories = getArray(req.query.categories);

        const where: WhereOptions = {
            category: {
                [Op.and]: [
                    typeof excludeCategory === 'string'
                        ? {
                              [Op.not]: excludeCategory,
                          }
                        : undefined,
                    categories.length > 0
                        ? {
                              [Op.in]: categories,
                          }
                        : undefined,
                ].filter((x) => x),
            },
        };

        if (typeof name === 'string') {
            where.name = {
                [Op.like]: `%${name}%`,
            };
        }

        const [items, count] = await Promise.all([
            await Item.findAll({
                limit,
                offset,
                where,
                order:
                    sort !== null ? [[sort.field, sort.direction]] : undefined,
            }),
            await Item.count({
                where,
            }),
        ]);

        res.json({
            items,
            count,
        });
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
            const { name, category, unitPrice, stackPrice, stackSize } =
                req.body;

            const item = await Item.create({
                name,
                category,
                unitPrice,
                stackPrice,
                stackSize,
            });

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
            const item = await Item.findByPk(id);

            if (item === null) {
                res.sendStatus(404);
                return;
            }

            const { name, category, unitPrice, stackPrice, stackSize } =
                req.body;

            await Item.update(
                {
                    id,
                    name,
                    category,
                    unitPrice,
                    stackPrice,
                    stackSize,
                },
                {
                    where: { id },
                }
            );

            const updatedItem = await Item.findByPk(id);

            res.send(updatedItem);
        });
    }
);

router.delete('/:id', (req, res, next) => {
    const { id } = req.params;

    // eslint-disable-next-line
    withErrorHandling(next, async () => {
        const item = await Item.findByPk(id);

        if (item === null) {
            res.sendStatus(404);
            return;
        }

        await Item.destroy({ where: { id } });

        res.sendStatus(200);
    });
});

export default router;
