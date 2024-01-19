import {
    type CreationOptional,
    DataTypes,
    type InferAttributes,
    type InferCreationAttributes,
    Model,
} from 'sequelize';
import { sequelize } from '../sequelize';
import { type Craft } from '../enums';
import { isCraft } from '../validators';
import { Synthesis } from '.';

export default class SynthesisSubCraft extends Model<
    InferAttributes<SynthesisSubCraft>,
    InferCreationAttributes<SynthesisSubCraft>
> {
    declare id: CreationOptional<number>;
    declare synthesisId: number;
    declare craft: Craft;
    declare craftLevel: number;
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
        synthesisId: {
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
            validate: {
                isCraft: (val: any) => isCraft(val),
            },
        },
        craftLevel: {
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
