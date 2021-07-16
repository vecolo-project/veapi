import { Router } from 'express';
import { attachUser, checkRole, isAuth } from '../middlewares';
import { Role } from '../entities/User';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import BikeModelService from '../services/BikeModelService';
import InvoiceService from '../services/InvoiceService';
import { userRequest } from '../../types/userRequest';
import * as fs from 'fs';

const route = Router();
const paramsRules = celebrate({
  body: Joi.object({
    billingDate: Joi.date().required(),
    amount: Joi.number().min(0).required(),
    subscription: Joi.number().min(0).required(),
    user: Joi.number().min(0).required(),
  }),
});
const defaultService = InvoiceService;

route.post(
  '/',
  isAuth,
  checkRole(Role.ADMIN),
  paramsRules,
  async (req, res, next) => {
    const service = Container.get(defaultService);
    try {
      const entityResult = await service.create(req.body);
      return res.status(201).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);

route.get('/', isAuth, checkRole(Role.STAFF), async (req, res, next) => {
  try {
    const service = Container.get(defaultService);
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 20;
    const entityResult = await service.find({ offset, limit });
    return res.status(200).json(entityResult);
  } catch (e) {
    return next(e);
  }
});

route.delete(
  '/' + ':id',
  isAuth,
  checkRole(Role.ADMIN),
  async (req, res, next) => {
    try {
      const service = Container.get(defaultService);
      const id = Number.parseInt(req.params.id);
      const serviceBikeModel = Container.get(BikeModelService);
      const model = await serviceBikeModel.getAllFromManufacturer(id);
      if (model.length != 0)
        return res
          .status(403)
          .json({ message: 'Impossible de supprimer ce constructeur' });
      await service.delete(id);
      return res.status(204);
    } catch (e) {
      return next(e);
    }
  }
);

route.put(
  '/' + ':id',
  isAuth,
  checkRole(Role.STAFF),
  paramsRules,
  async (req, res, next) => {
    const service = Container.get(defaultService);
    const id = Number.parseInt(req.params.id);
    try {
      const entityResult = await service.update(id, req.body);
      return res.status(201).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);

route.get('/me/', isAuth, attachUser, async (req: userRequest, res, next) => {
  try {
    const service = Container.get(defaultService);
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 20;
    const [invoices, count] = await service.getAllFromUser(req.currentUser.id, {
      offset,
      limit,
    });
    return res.status(200).json({ invoices, count });
  } catch (e) {
    return next(e);
  }
});

route.get(
  '/' + ':id',
  isAuth,
  checkRole(Role.STAFF),
  async (req, res, next) => {
    try {
      const service = Container.get(defaultService);
      const id = Number.parseInt(req.params.id);
      const entityResult = await service.findOne(id);
      return res.status(200).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);
route.get(
  '/user/:id',
  isAuth,
  checkRole(Role.STAFF),
  async (req: userRequest, res, next) => {
    try {
      const service = Container.get(defaultService);
      const offset = Number(req.query.offset) || 0;
      const limit = Number(req.query.limit) || 20;
      const userId = Number.parseInt(req.params.id, 10);
      const [invoices, count] = await service.getAllFromUser(userId, {
        offset,
        limit,
      });
      return res.status(200).json({ invoices, count });
    } catch (e) {
      return next(e);
    }
  }
);

route.get(
  '/me/:id',
  isAuth,
  attachUser,
  async (req: userRequest, res, next) => {
    try {
      const service = Container.get(defaultService);
      const id = Number.parseInt(req.params.id);
      const entityResult = await service.findOne(id);
      if (entityResult.user.id != req.currentUser.id) return res.status(403);
      return res.status(200).json(entityResult);
    } catch (e) {
      return next(e);
    }
  }
);

route.get(
  '/export/:id',
  isAuth,
  attachUser,
  async (req: userRequest, res, next) => {
    try {
      const service = Container.get(defaultService);

      const id = Number.parseInt(req.params.id, 10);
      const doc = await service.generateInvoicePDF(id, req.currentUser);
      res.setHeader(
        'Content-disposition',
        'attachment; filename="invoice.pdf""'
      );
      res.setHeader('Content-type', 'application/pdf');
      doc.pipe(res);
      doc.end();
      // return res.status(200).end();
    } catch (e) {
      return next(e);
    }
  }
);

export default route;
