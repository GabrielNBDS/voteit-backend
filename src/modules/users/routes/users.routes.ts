import { Router } from 'express';

import UsersController from '../controllers/UsersController';
import EnsureAuthentication from '../middlewares/EnsureAuthentication';

const usersRouter = Router();

const usersController = new UsersController();

usersRouter.post('/', usersController.create);
usersRouter.post('/update', EnsureAuthentication, usersController.update);
usersRouter.delete('/delete', EnsureAuthentication, usersController.delete);

export default usersRouter;
