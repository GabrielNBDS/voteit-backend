import { Router } from 'express';

import usersRouter from './modules/users/routes/users.routes';
import sessionsRouter from './modules/users/routes/sessions.routes';
import poolsRouter from './modules/pools/routes/pools.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/pools', poolsRouter);

export default routes;
