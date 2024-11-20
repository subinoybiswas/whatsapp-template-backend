import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import { body } from 'express-validator';
import validateTemplateController from './controllers/validateTemplateController';
import generatePreviewController from './controllers/generatePreviewController';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors({
  origin: ["https://whatsapp-template-frontend-three.vercel.app"],
}));
app.use(express.json());

app.get("/", async (req, res) => {
  res.send({ message: "Hi" });
})

app.get("/healthcheck", async (req, res) => {
  res.send({ message: "Healthy" });
})

app.post('/validate-template',
  body('template').isString(),
  validateTemplateController
);

app.post('/generate-preview',
  body('template').isString(),
  body('variables').isObject(),
  generatePreviewController
);


app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
