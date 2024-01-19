import {
    type CreationOptional,
    DataTypes,
    type InferAttributes,
    type InferCreationAttributes,
    Model,
} from 'sequelize';
import { sequelize } from '../sequelize';
import { Item, Synthesis } from '.';

export default class SynthesisIngredient extends Model<
    InferAttributes<SynthesisIngredient>,
    InferCreationAttributes<SynthesisIngredient>
> {
    declare id: CreationOptional<number>;
    declare synthesisId: number;
    declare itemId: number;
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
        synthesisId: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: Synthesis,
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        itemId: {
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
            validate: {
                min: 1,
            },
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
