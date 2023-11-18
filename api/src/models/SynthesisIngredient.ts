import {
    type CreationOptional,
    DataTypes,
    type InferAttributes,
    type InferCreationAttributes,
    Model,
} from 'sequelize';
import { sequelize } from '../sequelize';
import { Item } from './Item';
import { Synthesis } from './Synthesis';

export class SynthesisIngredient extends Model<
    InferAttributes<SynthesisIngredient>,
    InferCreationAttributes<SynthesisIngredient>
> {
    declare id: CreationOptional<number>;
    declare synthesis_id: number;
    declare item_id: number;
    declare quantity: CreationOptional<number>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

SynthesisIngredient.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        synthesis_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: Synthesis,
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        item_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: Item,
                key: 'id',
            },
        },
        quantity: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 1,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        tableName: 'synthesis_ingredients',
        underscored: true,
        sequelize,
    }
);
