import { Router } from "express";
import { ItemsRepository } from "./database/ItemsRepository";
import { validateItem } from "./validators";

const router = Router();

router.get("/", async (req, res) => {
  const items = await ItemsRepository.find();
  res.json({ items });
});

router.post("/", async (req, res) => {
  const { item } = req.body;

  try {
    validateItem(item);
  } catch (err) {
    res.status(400);
    return res.json({ error: err.message });
  }

  try {
    const createdItem = await ItemsRepository.create(item);
    res.json({ createdItem });
  } catch (err) {
    res.status(500);
    return res.json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { item } = req.body;

  try {
    validateItem(item);
  } catch (err) {
    res.status(400);
    return res.json({ error: err.message });
  }

  try {
    const updatedItem = await ItemsRepository.update({ ...item, id });
    res.json({ updatedItem });
  } catch (err) {
    res.status(500);
    return res.json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await ItemsRepository.delete(id);
    res.sendStatus(200);
  } catch (err) {
    res.status(500);
    return res.json({ error: err.message });
  }
});

export default router;
