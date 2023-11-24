import { Router } from 'express';
import { getLimitAndOffset, withErrorHandling } from './utilities';
import { Synthesis } from '../models/Synthesis';
import { Item } from '../models/Item';
import { SynthesisIngredient } from '../models/SynthesisIngredient';
import { SynthesisSubCraft } from '../models/SynthesisSubCraft';

const router = Router();

router.get('/', (req, res, next): void => {
    // eslint-disable-next-line
    withErrorHandling(next, async () => {
        const { limit, offset } = getLimitAndOffset(req);
        const synthesis = await Synthesis.findAll({
            limit,
            offset,
            include: [
                {
                    model: SynthesisSubCraft,
                    as: 'subCrafts',
                },
                {
                    model: Item,
                    as: 'crystal',
                },
                {
                    model: Item,
                    as: 'product',
                },
                {
                    model: SynthesisIngredient,
                    as: 'ingredients',
                    include: [
                        {
                            model: Item,
                            as: 'item',
                        },
                    ],
                },
            ],
        });
        res.json(synthesis);
    });
});

export default router;
