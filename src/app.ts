import 'module-alias/register';
import { app, db } from '@/services';

db.connect();
app.start();

export default app;
