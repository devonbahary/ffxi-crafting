import {
    type CreationOptional,
    DataTypes,
    type InferAttributes,
    type InferCreationAttributes,
    Model,
} from 'sequelize';
import { sequelize } from '../sequelize';
import { type Craft } from '../enums';
import { Synthesis } from './Synthesis';

export class SynthesisSubCraft extends Model<
    InferAttributes<SynthesisSubCraft>,
    InferCreationAttributes<SynthesisSubCraft>
> {
    declare id: CreationOptional<number>;
    declare synthesis_id: number;
    declare craft: Craft;
    declare craft_level: number;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

SynthesisSubCraft.init(
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
            allowNull: false,
            onDelete: 'CASCADE',
        },
        craft: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        craft_level: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        tableName: 'synthesis_sub_crafts',
        underscored: true,
        sequelize,
    }
);
