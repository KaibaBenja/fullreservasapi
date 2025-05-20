import express, { Request, Response, NextFunction } from 'express';
import footerController from '../controllers/footer.controller';
import { validateSchema, validateSchemaPartial } from '../../../middlewares/validateSchema';
import { footerSchema } from '../schemas/footer.schema';

export const footerRoutes = express.Router();

footerRoutes.post('/', validateSchema(footerSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await footerController.add(req, res);
  } catch (error) {
    next(error);
  }
});

footerRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await footerController.getAll(req, res);
  } catch (error) {
    next(error);
  }
});

footerRoutes.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await footerController.getById(req, res);
  } catch (error) {
    next(error);
  }
});

footerRoutes.get('/key/:key', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await footerController.getByKey(req, res);
  } catch (error) {
    next(error);
  }
});

footerRoutes.patch('/:id', validateSchemaPartial(footerSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await footerController.editById(req, res);
  } catch (error) {
    next(error);
  }
});

footerRoutes.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await footerController.deleteById(req, res);
  } catch (error) {
    next(error);
  }
});
