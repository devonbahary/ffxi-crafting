import { CRAFT, PRICE_TYPE, STACK_SIZE } from "./constants";

const isInEnum = (map, value) => {
  return Object.values(map).includes(value);
};

export const validateCraft = (craft) => {
  if (!isInEnum(CRAFT, craft)) {
    throw new Error(`do not recognize craft ${craft}`);
  }
};

export const validateItem = (item) => {
  const { name, price_type, price, stack_size } = item;

  if (!name) throw new Error(`item.name is required`);

  if (!isInEnum(PRICE_TYPE, price_type)) {
    throw new Error(`do not recognize item.price_type ${priceType}`);
  }

  if (!isInEnum(STACK_SIZE, stack_size)) {
    throw new Error(`do not recognize item.stack_size ${stack_size}`);
  }

  if (!price) {
    throw new Error(`item.price is required`);
  }
};
