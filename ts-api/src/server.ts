import express from 'express';
import { config } from 'dotenv';

config();

import items from './routes/items';

const { PORT } = process.env;

const app = express();

app.use(express.json());
app.use('/items', items);

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
