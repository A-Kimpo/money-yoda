import express, { json, urlencoded } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config';

import routes from '@/routes';

// App init
const app = express();

// Logging
const logger = morgan('combined');
app.use(logger);

// CORS
app.use(cors());

// Request middlewares
app.use(json());
app.use(urlencoded({ extended: true }));

// Routing
app.use('/api', routes);

// Echo
app.get('/', (req, res) => {
  res.send(`${process.env.APP} started on port: ${process.env.PORT}`);
});

export const start = () => {
  app.listen(process.env.PORT, () => {
    console.log(`${process.env.APP} started on port: ${process.env.PORT}`);
  });
};

export default app;
