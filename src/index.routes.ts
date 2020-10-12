import { Router } from 'express';

import usersRouter from './modules/users/routes/users.routes';
import sessionsRouter from './modules/users/routes/sessions.routes';
import poolsRouter from './modules/pools/routes/pools.routes';
import candidatesRouter from './modules/candidates/routes/candidates.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/pools', poolsRouter);
routes.use('/candidates', candidatesRouter);

export default routes;
