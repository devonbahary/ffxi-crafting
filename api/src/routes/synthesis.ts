import {
    type NextFunction,
    type Request,
    type Response,
    Router,
} from 'express';
import { getArray, getLimitAndOffset, withErrorHandling } from './utilities';
import {
    createSynthesisCraftLevelValidator,
    createSynthesisCraftValidator,
    createSynthesisCrystalValidator,
    createSynthesisIngredientsValidators,
    createSynthesisItemValidator,
    createSynthesisSubCraftsValidators,
    createSynthesisYieldValidator,
} from '../validators';
import { validationResult } from 'express-validator';
import {
    createSynthesis,
    getSyntheses,
    getSynthesis,
    updateSynthesis,
} from '../services/synthesis-service';
import { Synthesis } from '../models/Synthesis';
import { type Craft } from '../enums';

const router = Router();

const createValidationRules = [
    createSynthesisYieldValidator(),
    createSynthesisItemValidator(),
    createSynthesisCrystalValidator(),
    createSynthesisCraftValidator(),
    createSynthesisCraftLevelValidator(),
    ...createSynthesisSubCraftsValidators(),
    ...createSynthesisIngredientsValidators(),
];

router.get('/', (req, res, next): void => {
    // eslint-disable-next-line
    withErrorHandling(next, async () => {
        const { limit, offset } = getLimitAndOffset(req);

        const crafts = getArray<Craft>(req.query.crafts);

        const synthesis = await getSyntheses({
            limit,
            offset,
            searchParams: {
                crafts,
            },
        });

        res.json(synthesis);
    });
});

router.get('/:id', (req, res, next): void => {
    // eslint-disable-next-line
    withErrorHandling(next, async () => {
        const synthesis = await getSynthesis(req.params.id);

        if (synthesis === null) {
            res.status(404);
            return;
        }

        res.send(synthesis.toJSON());
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
            const synthesis = await createSynthesis(req.body);
            res.json(synthesis);
        });
    }
);

router.put(
    '/:id',
    createValidationRules,
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // eslint-disable-next-line
        withErrorHandling(next, async () => {
            const {
                params: { id },
                body,
            } = req;

            const synthesis = await Synthesis.findByPk(id);

            if (synthesis === null) {
                res.sendStatus(404);
                return;
            }

            const updatedSynthesis = await updateSynthesis(id, body);

            res.json(updatedSynthesis);
        });
    }
);

router.delete('/:id', (req, res, next) => {
    const { id } = req.params;

    // eslint-disable-next-line
    withErrorHandling(next, async () => {
        const item = await Synthesis.findByPk(id);

        if (item === null) {
            res.sendStatus(404);
            return;
        }

        await Synthesis.destroy({ where: { id } });

        res.sendStatus(200);
    });
});

export default router;
