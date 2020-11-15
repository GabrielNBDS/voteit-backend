import { Router } from 'express';

import SessionsController from '../controllers/SessionsController';
import EnsureAuthentication from '../middlewares/EnsureAuthentication'

const sessionsRouter = Router();

const sessionsController = new SessionsController();

sessionsRouter.post('/', sessionsController.create);
sessionsRouter.get('/auth', EnsureAuthentication, sessionsController.check)

export default sessionsRouter;
