import { validateSynthesisIngredient } from "../validators";
import { ItemsRepository } from "./ItemsRepository";
import { MySQLService } from "./MySQLService";

export class SynthesisIngredientsRepository {
  static tableName = "synthesis_ingredients";

  static async create(synthesis_id, synthesis_ingredient) {
    validateSynthesisIngredient(synthesis_ingredient);

    const { item_id, quantity } = synthesis_ingredient;

    const { insertId } = await MySQLService.query(
      `
              INSERT INTO ${SynthesisIngredientsRepository.tableName} 
              (synthesis_id, item_id, quantity)
              VALUES (?, ?, ?)
          `,
      [synthesis_id, item_id, quantity],
    );

    const results = await MySQLService.query(
      `SELECT * FROM ${SynthesisIngredientsRepository.tableName} WHERE id = ?`,
      [insertId],
    );

    if (!results.length) {
      throw new Error(`failed to create synthesis_ingredient`);
    }

    return results[0];
  }

  static findBySynthesisId(synthesis_id) {
    return MySQLService.query(
      `
          SELECT ${SynthesisIngredientsRepository.tableName}.*, name, price, price_type, price, stack_size FROM ${SynthesisIngredientsRepository.tableName} 
          JOIN ${ItemsRepository.tableName} ON ${SynthesisIngredientsRepository.tableName}.item_id = ${ItemsRepository.tableName}.id
          WHERE synthesis_id = ?;
        `,
      [synthesis_id],
    );
  }

  static deleteBySynthesisId(synthesis_id) {
    return MySQLService.query(
      `
        DELETE FROM ${SynthesisIngredientsRepository.tableName} WHERE synthesis_id = ?
      `,
      [synthesis_id],
    );
  }
}
