import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import MessageResponse from './interfaces/MessageResponse';
import templateRoutes from './api/templateRoutes';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API Functional',
  });
});

app.use('/api', templateRoutes);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
