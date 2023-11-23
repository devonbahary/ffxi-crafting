import {
    type CreationOptional,
    DataTypes,
    type InferAttributes,
    type InferCreationAttributes,
    Model,
} from 'sequelize';
import { sequelize } from '../sequelize';
import { isCategory, isStackSize } from '../validators';

export enum Category {
    HandToHand = 'Weapons.Hand-to-Hand',
    Daggers = 'Weapons.Daggers',
    Swords = 'Weapons.Swords',
    GreatSwords = 'Weapons.Great Swords',
    Axes = 'Weapons.Axes',
    GreatAxes = 'Weapons.Great Axes',
    Scythes = 'Weapons.Scythes',
    Polearms = 'Weapons.Polearms',
    Katana = 'Weapons.Katana',
    GreatKatana = 'Weapons.Great Katana',
    Clubs = 'Weapons.Clubs',
    Staves = 'Weapons.Staves',
    Ranged = 'Weapons.Ranged',
    Instruments = 'Weapons.Instruments',
    Ammunition = 'Weapons.Ammo & Misc.Ammunition',
    FishingGear = 'Weapons.Ammo & Misc.Fishing Gear',
    Grips = 'Weapons.Ammo & Misc.Grips',
    PetItems = 'Weapons.Ammo & Misc.Pet Items',
    Shields = 'Armor.Shields',
    Head = 'Armor.Head',
    Neck = 'Armor.Neck',
    Body = 'Armor.Body',
    Hands = 'Armor.Hands',
    Waist = 'Armor.Waist',
    Legs = 'Armor.Legs',
    Feet = 'Armor.Feet',
    Back = 'Armor.Back',
    Earrings = 'Armor.Earrings',
    Rings = 'Armor.Rings',
    WhiteMagic = 'Scrolls.White Magic',
    BlackMagic = 'Scrolls.Black Magic',
    Songs = 'Scrolls.Songs',
    Ninjutsu = 'Scrolls.Ninjutsu',
    Summoning = 'Scrolls.Summoning',
    Dice = 'Scrolls.Dice',
    Geomancy = 'Scrolls.Geomancy',
    Medicine = 'Medicines',
    Furnishings = 'Furnishings',
    Smithing = 'Materials.Smithing',
    Goldsmithing = 'Materials.Goldsmithing',
    Clothcraft = 'Materials.Clothcraft',
    Leathercraft = 'Materials.Leathercraft',
    Bonecraft = 'Materials.Bonecraft',
    Woodworking = 'Materials.Woodworking',
    Alchemy = 'Materials.Alchemy',
    MeatAndEggs = 'Food.Meals.Meat & Eggs',
    Seafood = 'Food.Meals.Seafood',
    Vegetables = 'Food.Meals.Vegetables',
    Soups = 'Food.Meals.Soups',
    BreadAndRice = 'Food.Meals.Bread & Rice',
    Sweets = 'Food.Meals.Sweets',
    Drinks = 'Food.Meals.Drinks',
    Ingredients = 'Food.Ingredients',
    Fishing = 'Food.Fishing',
    Crystals = 'Crystals',
    Misc = 'Others.Misc.',
    Misc2 = 'Others.Misc 2',
    Misc3 = 'Others.Misc 3',
    BeastMade = 'Others.Beast-made',
    Cards = 'Others.Cards',
    NinjaTools = 'Others.Ninja Tools',
    CursedItems = 'Others.Cursed Items',
    Automaton = 'Others.Automaton',
}

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
