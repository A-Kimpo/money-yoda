import * as app from './express';
import * as db from './objection';

db.connect();
app.start();

export default app;
