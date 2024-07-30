import 'module-alias/register';
import * as app from './services/express';
import * as db from './services/objection';

db.connect();
app.start();

export default app;
