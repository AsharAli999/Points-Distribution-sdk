import express, {Application, Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './api/routes.js'

dotenv.config();
const app : Application = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
  });

const port : number =  3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});