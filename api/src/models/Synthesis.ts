import {
    type CreationOptional,
    DataTypes,
    type InferAttributes,
    type InferCreationAttributes,
    Model,
} from 'sequelize';
import { sequelize } from '../sequelize';
import { Item } from './Item';
import { type Craft } from '../enums';
import { isCraft } from '../validators';

export class Synthesis extends Model<
    InferAttributes<Synthesis>,
    InferCreationAttributes<Synthesis>
> {
    declare id: CreationOptional<number>;
    declare itemId: number;
    declare craft: Craft;
    declare craftLevel: number;
    declare crystalItemId: number;
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
        itemId: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: Item,
                key: 'id',
            },
            allowNull: false,
            onDelete: 'CASCADE',
        },
        craft: {
            type: DataTypes.STRING(128),
            allowNull: false,
            validate: {
                isCraft: (val: any) => isCraft(val),
            },
        },
        craftLevel: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        crystalItemId: {
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
