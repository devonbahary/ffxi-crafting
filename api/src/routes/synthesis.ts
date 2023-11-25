import {
    type NextFunction,
    type Request,
    type Response,
    Router,
} from 'express';
import { getLimitAndOffset, withErrorHandling } from './utilities';
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
import { createSynthesis, getSynthesis } from '../services/synthesis-service';

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
        const synthesis = await getSynthesis(limit, offset);
        res.json(synthesis);
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

export default router;
