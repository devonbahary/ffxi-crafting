import { MySQLService } from "./MySQLService";
import { ItemsRepository } from "./ItemsRepository";
import { validateSynthesis } from "../validators";
import { SynthesisIngredientsRepository } from "./SynthesisIngredientsRepository";

export class SynthesisRepository {
  static tableName = "synthesis";

  static async find(craft) {
    let sql = `
          SELECT synthesis.id as synthesis_id,
          synthesis.craft as synthesis_craft,
          synthesis.crystal as synthesis_crystal,
          synthesis.yield as synthesis_yield,
          synthesis.item_id as synthesis_item_id, 
          synthesis_item.name as synthesis_item_name, 
          synthesis_item.price as synthesis_item_price, 
          synthesis_item.price_type as synthesis_item_price_type, 
          synthesis_item.stack_size as synthesis_item_stack_size,
          synthesis_ingredient.id as synthesis_ingredient_id,
          synthesis_ingredient.item_id as synthesis_ingredient_item_id,
          synthesis_ingredient.quantity as synthesis_ingredient_quantity,
          ingredient_item.name as synthesis_ingredient_item_name,
          ingredient_item.price as synthesis_ingredient_item_price, 
          ingredient_item.price_type as synthesis_ingredient_item_price_type, 
          ingredient_item.stack_size as synthesis_ingredient_item_stack_size
          FROM ${SynthesisRepository.tableName} as synthesis
          JOIN ${ItemsRepository.tableName} as synthesis_item ON ${SynthesisRepository.tableName}.item_id = synthesis_item.id
          LEFT JOIN ${SynthesisIngredientsRepository.tableName} as synthesis_ingredient ON synthesis_ingredient.synthesis_id = synthesis.id
          LEFT JOIN ${ItemsRepository.tableName} as ingredient_item ON synthesis_ingredient.item_id = ingredient_item.id
        `;

    if (craft) {
      sql += ` WHERE craft = ?`;
    }

    const results = await MySQLService.query(sql, [craft]);
    return results;
  }

  static async create(synthesis) {
    validateSynthesis(synthesis);

    const { item_id, craft, crystal, yield: yieldd } = synthesis;

    const { insertId } = await MySQLService.query(
      `
              INSERT INTO ${SynthesisRepository.tableName} 
              (item_id, craft, crystal, yield)
              VALUES (?, ?, ?, ?)
          `,
      [item_id, craft, crystal, yieldd]
    );

    const results = await MySQLService.query(
      `SELECT * FROM ${SynthesisRepository.tableName} WHERE id = ?`,
      [insertId]
    );

    if (!results.length) {
      throw new Error(`failed to create synthesis`);
    }

    return results[0];
  }

  static delete(id) {
    return MySQLService.query(
      `
        DELETE FROM ${SynthesisRepository.tableName} WHERE id = ?
      `,
      [id]
    );
  }
}
