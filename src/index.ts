import express, { Application, json } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import propertyRoutes from './routes/property.routes';
import uiRoutes from './routes/ui.routes';

dotenv.config();

const app: Application = express();
const port: number = Number(process.env.SERVER_PORT) || 4000;

app.use(
    cors({
        origin: process.env.REACT_URL
    })
);
app.use(morgan('dev'));
app.use(json());

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', propertyRoutes);
app.use('/api', uiRoutes);

app.listen(port, () => {
    console.log('Server running on port', port);
});
