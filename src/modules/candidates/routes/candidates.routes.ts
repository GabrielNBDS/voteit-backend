import { Router } from 'express';
import multer from 'multer';

import CandidatesController from '../controllers/CandidatesController';
import EnsureAuthentication from '../../users/middlewares/EnsureAuthentication';
import uploadConfig from '../../../configs/uploads';

const candidatesRouter = Router();
const candidatesController = new CandidatesController();

const upload = multer(uploadConfig);

candidatesRouter.post(
  '/:id',
  upload.single('image'),
  EnsureAuthentication,
  candidatesController.create,
);
candidatesRouter.post('/vote/:id', candidatesController.add_vote);
candidatesRouter.get('/', candidatesController.read);

candidatesRouter.patch(
  '/:id',
  EnsureAuthentication,
  candidatesController.update,
);

candidatesRouter.put(
  '/:id',
  upload.single('image'),
  EnsureAuthentication,
  candidatesController.update_image,
);

candidatesRouter.delete(
  '/:id',
  EnsureAuthentication,
  candidatesController.delete,
);

export default candidatesRouter;
