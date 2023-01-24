import axios from "axios";
import { Craft } from "./constants";

export const getItems = async () => {
  const {
    data: { items },
  } = await axios.get("/items", { params: { craft: Craft.Alchemy } });
  return items;
};

export const createItem = async (item) => {
  try {
    const {
      data: { createdItem },
    } = await axios.post("/items", { item });
    return createdItem;
  } catch (err) {
    const {
      response: {
        data: { error },
      },
    } = err;
    throw new Error(error);
  }
};

export const updateItem = async (item) => {
  try {
    const {
      data: { updatedItem },
    } = await axios.put(`/items/${item.id}`, { item });
    return updatedItem;
  } catch (err) {
    const {
      response: {
        data: { error },
      },
    } = err;
    throw new Error(error);
  }
};

export const deleteItem = async (id) => {
  try {
    await axios.delete(`/items/${id}`);
  } catch (err) {
    const {
      response: {
        data: { error },
      },
    } = err;
    throw new Error(error);
  }
};
