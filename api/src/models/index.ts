import { type UpdateOptions } from 'sequelize';
import Item from './Item';
import Synthesis from './Synthesis';
import SynthesisIngredient from './SynthesisIngredient';
import SynthesisSubCraft from './SynthesisSubCraft';
import {
    updateSynthProfitsFromIngredient,
    updateSynthProfitsFromItem,
    updateSynthProfitsFromSynth,
} from './update-synth-profits-hooks';

Synthesis.hasMany(SynthesisIngredient, { as: 'ingredients' });
Synthesis.hasMany(SynthesisSubCraft, { as: 'subCrafts' });
Synthesis.belongsTo(Item, { foreignKey: 'itemId', as: 'product' });
Synthesis.belongsTo(Item, { foreignKey: 'crystalItemId', as: 'crystal' });
SynthesisIngredient.belongsTo(Item, { as: 'item' });

const addIndividualHooks = (options: UpdateOptions): void => {
    options.individualHooks = true;
};

Item.addHook('beforeBulkUpdate', addIndividualHooks);
Item.addHook('afterUpdate', updateSynthProfitsFromItem);

Synthesis.addHook('beforeBulkUpdate', addIndividualHooks);
Synthesis.addHook('beforeUpdate', updateSynthProfitsFromSynth);

SynthesisIngredient.addHook('beforeBulkUpdate', addIndividualHooks);
SynthesisIngredient.addHook('afterCreate', updateSynthProfitsFromIngredient);
SynthesisIngredient.addHook('afterUpdate', updateSynthProfitsFromIngredient);

export { Item, Synthesis, SynthesisIngredient, SynthesisSubCraft };
