import { Item } from '../models/Item';

export class ItemsRepository {
    static findAll(limit = 25, offset = 0): Promise<Item[]> {
        return Item.findAll({
            limit,
            offset,
        });
    }

    static createOne(item: Item): Promise<Item> {
        return Item.create(item);
    }

    static findById(id: number | string): Promise<Item | null> {
        return Item.findOne({
            where: { id },
        });
    }

    static async updateOne(item: Item): Promise<Item | null> {
        await Item.update(item, {
            where: { id: item.id },
        });

        return ItemsRepository.findById(item.id);
    }

    static async deleteOne(id: number | string): Promise<number> {
        return Item.destroy({
            where: { id },
        });
    }
}
