import { CATEGORY, CRYSTAL } from "../constants";
import { validateItem } from "../validators";
import { MySQLService } from "./MySQLService";

const crystalItemNames = Object.values(CRYSTAL).map(
  (crystal) => `'${crystal} Crystal'`
);

export class ItemsRepository {
  static tableName = "items";

  static async find({ name, category }) {
    let sql = `SELECT * FROM ${ItemsRepository.tableName}`;
    const values = [];

    if (name || category) {
      sql += ` WHERE `;

      if (name) {
        sql += ` name LIKE ?`;
        values.push(`%${name}%`);
      }

      if (name && category) {
        sql += ` AND `;
      }

      if (category) {
        sql += ` category = ?`;
        values.push(category);
      }
    }

    return MySQLService.query(sql, values);
  }

  static async findCrystals() {
    let sql = `
      SELECT * FROM ${ItemsRepository.tableName}
      WHERE name IN (${crystalItemNames.join(",")})
      AND category = '${CATEGORY.Crystals}'
    `;

    return MySQLService.query(sql);
  }

  static async create(item) {
    validateItem(item);

    const { name, price_type, price, stack_size, category } = item;

    const { insertId } = await MySQLService.query(
      `
          INSERT INTO ${ItemsRepository.tableName} 
          (name, price_type, price, stack_size, updated_on, category)
          VALUES (?, ?, ?, ?, NOW(), ?)
      `,
      [name, price_type, price, stack_size, category]
    );

    const results = await MySQLService.query(
      `SELECT * FROM ${ItemsRepository.tableName} WHERE id = ?`,
      [insertId]
    );

    if (!results.length) {
      throw new Error(`failed to create item`);
    }

    return results[0];
  }

  static async update(item) {
    validateItem(item);

    const { id, name, price_type, price, stack_size, category } = item;

    if (!id) {
      throw new Error(`can't update item with no id`);
    }

    await MySQLService.query(
      `
          UPDATE ${ItemsRepository.tableName} 
          SET name = ?, price_type = ?, price = ?, stack_size = ?, updated_on = NOW(), category = ?
          WHERE id = ?
      `,
      [name, price_type, price, stack_size, category, id]
    );

    const results = await MySQLService.query(
      `SELECT * FROM ${ItemsRepository.tableName} WHERE id = ?`,
      [id]
    );

    if (!results.length) {
      throw new Error(`can't update record with id ${id}`);
    }

    return results[0];
  }

  static delete(id) {
    return MySQLService.query(
      `
        DELETE FROM ${ItemsRepository.tableName} WHERE id = ?
      `,
      [id]
    );
  }
}
