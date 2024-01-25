import express, {
    type Response,
    type Request,
    type NextFunction,
} from 'express';
import path from 'path';
import { config } from 'dotenv';
import items from './routes/items';
import synthesis from './routes/synthesis';

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

const pathToClient = path.join(__dirname, '/../../ffxi-crafting-app/build');

app.use(express.static(pathToClient));

app.use('/items', items);
app.use('/synthesis', synthesis);

// https://create-react-app.dev/docs/deployment/#serving-apps-with-client-side-routing
app.get('/*', (req, res) => {
    res.sendFile(path.join(pathToClient, 'index.html'));
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send({
        error: err.message,
    });
});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
