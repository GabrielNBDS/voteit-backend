import { Router } from 'express';

import usersRouter from './modules/users/routes/users.routes';
import sessionsRouter from './modules/users/routes/sessions.routes';
import classesRouter from './modules/classes/routes/classes.routes';
import studentsRouter from './modules/students/routes/students.routes';
import presencesRouter from './modules/students/routes/presences.routes';
import faultsRouter from './modules/students/routes/faults.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/classes', classesRouter);
routes.use('/students', studentsRouter);
routes.use('/presences', presencesRouter);
routes.use('/faults', faultsRouter);

export default routes;
