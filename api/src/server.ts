import express, { Response, Request, NextFunction } from 'express';
import { config } from 'dotenv';
import items from './routes/items';

config();

const { PORT, ACCESS_CONTROL_ALLOW_ORIGIN } = process.env;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', ACCESS_CONTROL_ALLOW_ORIGIN);
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, GET, DELETE, OPTIONS'
    );
    next();
});

app.use('/items', items);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send({
        error: err.message,
    });
});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
