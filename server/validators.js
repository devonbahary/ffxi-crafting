import { CATEGORY, CRAFT, CRYSTAL, PRICE_TYPE, STACK_SIZE } from "./constants";

const isInEnum = (map, value) => {
  return Object.values(map).includes(value);
};

export const validateCraft = (craft) => {
  if (!isInEnum(CRAFT, craft)) {
    throw new Error(`do not recognize craft ${craft}`);
  }
};

export const validateItem = (item) => {
  const { name, price_type, price, stack_size, category } = item;

  if (!name) throw new Error(`item.name is required`);

  if (!isInEnum(PRICE_TYPE, price_type)) {
    throw new Error(`do not recognize item.price_type ${priceType}`);
  }

  if (!isInEnum(STACK_SIZE, stack_size)) {
    throw new Error(`do not recognize item.stack_size ${stack_size}`);
  }

  if (!isInEnum(CATEGORY, category)) {
    throw new Error(`do not recognize item.category ${category}`);
  }

  if (!price) {
    throw new Error(`item.price is required`);
  }
};

export const validateSynthesis = (synthesis) => {
  const { item_id, crystal, craft, level, yield: yieldd } = synthesis;

  if (!item_id) throw new Error(`must select item for synthesis`);

  if (!yieldd || yieldd < 1 || yieldd > 99) {
    throw new Error(`synthesis.yield must be 1-99`);
  }

  if (!level || level < 1 || level > 110) {
    throw new Error(`synthesis.level must be 1-110`);
  }

  if (!isInEnum(CRAFT, craft)) {
    throw new Error(`do not recognize synthesis.craft ${craft}`);
  }

  if (!isInEnum(CRYSTAL, crystal)) {
    throw new Error(`do not recognize synthesis.crystal ${crystal}`);
  }
};

export const validateSynthesisIngredient = (synthesisIngredient) => {
  const { item_id, quantity } = synthesisIngredient;

  if (!item_id) throw new Error(`must select item for synthesis_ingredient`);

  if (!quantity || quantity < 1)
    throw new Error(`must select a quantity > 0 for synthesis_ingredient`);
};
