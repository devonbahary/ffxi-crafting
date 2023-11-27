import {
    type CreationOptional,
    DataTypes,
    type InferAttributes,
    type InferCreationAttributes,
    Model,
} from 'sequelize';
import { sequelize } from '../sequelize';
import { isCategory, isStackSize } from '../validators';
import { type Category } from '../enums';

export class Item extends Model<
    InferAttributes<Item>,
    InferCreationAttributes<Item>
> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare category: Category;
    declare unitPrice: CreationOptional<number>;
    declare stackPrice: CreationOptional<number>;
    declare stackSize: CreationOptional<number>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Item.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false,
            unique: true,
        },
        category: {
            type: DataTypes.STRING(128),
            allowNull: false,
            validate: {
                isCategory: (val: any) => isCategory(val),
            },
        },
        unitPrice: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
        stackPrice: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
        stackSize: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 1,
            validate: {
                isStackSize: (val: any) => isStackSize(val),
            },
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        tableName: 'items',
        underscored: true,
        sequelize,
    }
);
