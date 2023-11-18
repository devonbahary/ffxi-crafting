import {
    type CreationOptional,
    DataTypes,
    type InferAttributes,
    type InferCreationAttributes,
    Model,
} from 'sequelize';
import { sequelize } from '../sequelize';
import { Item } from './Item';

export class Synthesis extends Model<
    InferAttributes<Synthesis>,
    InferCreationAttributes<Synthesis>
> {
    declare id: CreationOptional<number>;
    declare item_id: number;
    declare crystal_item_id: number;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Synthesis.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        item_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: Item,
                key: 'id',
            },
            allowNull: false,
            onDelete: 'CASCADE',
        },
        crystal_item_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: Item,
                key: 'id',
            },
            allowNull: false,
            onDelete: 'CASCADE',
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        tableName: 'synthesis',
        underscored: true,
        sequelize,
    }
);
