import { Router } from 'express';

import PoolsController from '../controllers/PoolsController';
import EnsureAuthentication from '../../users/middlewares/EnsureAuthentication';

const poolsRouter = Router();

const poolsController = new PoolsController();

poolsRouter.post('/', EnsureAuthentication, poolsController.create);
poolsRouter.get('/', EnsureAuthentication, poolsController.read);
poolsRouter.get('/all', poolsController.index);
poolsRouter.post('/:id', EnsureAuthentication, poolsController.update);
poolsRouter.delete('/:id', EnsureAuthentication, poolsController.delete);

export default poolsRouter;
