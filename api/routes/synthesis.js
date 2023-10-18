import { Router } from "express";
import { SynthesisIngredientsRepository } from "../database/SynthesisIngredientsRepository";
import { SynthesisRepository } from "../database/SynthesisRepository";
import { validateSynthesis, validateSynthesisIngredient } from "../validators";

const router = Router();

router.get("/", async (req, res, next) => {
  const { craft } = req.query;
  try {
    const synthesisResults = await SynthesisRepository.find({ craft });

    const synthesisToSynthesisIngredientsMap = {};

    for (const synthesisResult of synthesisResults) {
      const { synthesis_id } = synthesisResult;

      if (!synthesisToSynthesisIngredientsMap[synthesis_id]) {
        const {
          synthesis_craft,
          synthesis_level,
          synthesis_crystal,
          synthesis_yield,
          synthesis_item_id,
          synthesis_item_name,
          synthesis_item_price,
          synthesis_item_price_type,
          synthesis_item_stack_size,
        } = synthesisResult;

        synthesisToSynthesisIngredientsMap[synthesis_id] = {
          synthesis: {
            id: synthesis_id,
            craft: synthesis_craft,
            crystal: synthesis_crystal,
            yield: synthesis_yield,
            level: synthesis_level,
            item: {
              id: synthesis_item_id,
              name: synthesis_item_name,
              price: synthesis_item_price,
              price_type: synthesis_item_price_type,
              stack_size: synthesis_item_stack_size,
            },
          },
          ingredients: [],
        };
      }

      const {
        synthesis_ingredient_id,
        synthesis_ingredient_item_id,
        synthesis_ingredient_quantity,
        synthesis_ingredient_item_name,
        synthesis_ingredient_item_price,
        synthesis_ingredient_item_price_type,
        synthesis_ingredient_item_stack_size,
      } = synthesisResult;

      if (!synthesis_ingredient_id) {
        continue;
      }

      const synthesisIngredient = {
        id: synthesis_ingredient_id,
        item_id: synthesis_ingredient_item_id,
        quantity: synthesis_ingredient_quantity,
        item: {
          id: synthesis_ingredient_item_id,
          name: synthesis_ingredient_item_name,
          price: synthesis_ingredient_item_price,
          price_type: synthesis_ingredient_item_price_type,
          stack_size: synthesis_ingredient_item_stack_size,
        },
      };

      synthesisToSynthesisIngredientsMap[synthesis_id].ingredients.push(
        synthesisIngredient,
      );
    }

    res.json({ synthesis: Object.values(synthesisToSynthesisIngredientsMap) });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res) => {
  const { synthesis, synthesisIngredients } = req.body;

  try {
    validateSynthesis(synthesis);

    if (!synthesisIngredients) {
      throw new Error(`must pass synthesisIngredients`);
    }

    for (const synthesisIngredient of synthesisIngredients) {
      validateSynthesisIngredient(synthesisIngredient);
    }
  } catch (err) {
    res.status(400);
    return res.json({ error: err.message });
  }

  try {
    const createdSynthesis = await SynthesisRepository.create(synthesis);

    for (const synthesisIngredient of synthesisIngredients) {
      await SynthesisIngredientsRepository.create(
        createdSynthesis.id,
        synthesisIngredient,
      );
    }

    const synthesisResults = await SynthesisRepository.find({
      id: createdSynthesis.id,
    });

    const synthesisToSynthesisIngredientsMap = {};

    for (const synthesisResult of synthesisResults) {
      const { synthesis_id } = synthesisResult;

      if (!synthesisToSynthesisIngredientsMap[synthesis_id]) {
        const {
          synthesis_craft,
          synthesis_level,
          synthesis_crystal,
          synthesis_yield,
          synthesis_item_id,
          synthesis_item_name,
          synthesis_item_price,
          synthesis_item_price_type,
          synthesis_item_stack_size,
        } = synthesisResult;

        synthesisToSynthesisIngredientsMap[synthesis_id] = {
          synthesis: {
            id: synthesis_id,
            craft: synthesis_craft,
            crystal: synthesis_crystal,
            yield: synthesis_yield,
            level: synthesis_level,
            item: {
              id: synthesis_item_id,
              name: synthesis_item_name,
              price: synthesis_item_price,
              price_type: synthesis_item_price_type,
              stack_size: synthesis_item_stack_size,
            },
          },
          ingredients: [],
        };
      }

      const {
        synthesis_ingredient_id,
        synthesis_ingredient_item_id,
        synthesis_ingredient_quantity,
        synthesis_ingredient_item_name,
        synthesis_ingredient_item_price,
        synthesis_ingredient_item_price_type,
        synthesis_ingredient_item_stack_size,
      } = synthesisResult;

      if (!synthesis_ingredient_id) {
        continue;
      }

      const synthesisIngredient = {
        id: synthesis_ingredient_id,
        item_id: synthesis_ingredient_item_id,
        quantity: synthesis_ingredient_quantity,
        item: {
          id: synthesis_ingredient_item_id,
          name: synthesis_ingredient_item_name,
          price: synthesis_ingredient_item_price,
          price_type: synthesis_ingredient_item_price_type,
          stack_size: synthesis_ingredient_item_stack_size,
        },
      };

      synthesisToSynthesisIngredientsMap[synthesis_id].ingredients.push(
        synthesisIngredient,
      );
    }

    res.json({
      createdSynthesis: synthesisToSynthesisIngredientsMap[createdSynthesis.id],
    });
  } catch (err) {
    res.status(500);
    return res.json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await SynthesisIngredientsRepository.deleteBySynthesisId(id);
    await SynthesisRepository.delete(id);
    res.sendStatus(200);
  } catch (err) {
    res.status(500);
    return res.json({ error: err.message });
  }
});

export default router;
