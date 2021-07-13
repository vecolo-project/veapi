import { Router } from 'express';
import { Container } from 'typedi';
import StatisticsService from '../services/StatisticsService';

const route = Router();

route.get('/subscriptions', async (req, res, next) => {
  const service = Container.get(StatisticsService);
  try {
    res.status(200).json(await service.getSubscriptionsRepartitions());
  } catch (err) {
    return next(err);
  }
});
route.get('/incomes', async (req, res, next) => {
  const service = Container.get(StatisticsService);
  try {
    const month = Number.parseInt(req.query.month.toString(), 10) - 1;
    const year = Number.parseInt(req.query.year.toString(), 10);
    res.status(200).json(await service.getMonthIncome(month, year));
  } catch (err) {
    return next(err);
  }
});

route.get('/user-subscriptions', async (req, res, next) => {
  const service = Container.get(StatisticsService);
  try {
    const month = Number.parseInt(req.query.month.toString(), 10) - 1;
    const year = Number.parseInt(req.query.year.toString(), 10);
    res.status(200).json(await service.getMonthUserSubscription(month, year));
  } catch (err) {
    return next(err);
  }
});

route.get('/rides', async (req, res, next) => {
  const service = Container.get(StatisticsService);
  try {
    const month = Number.parseInt(req.query.month.toString(), 10) - 1;
    const year = Number.parseInt(req.query.year.toString(), 10);
    res.status(200).json(await service.getRideMonthCount(month, year));
  } catch (err) {
    return next(err);
  }
});
route.get('/stations', async (req, res, next) => {
  const service = Container.get(StatisticsService);
  try {
    res.status(200).json(await service.getActiveStation());
  } catch (err) {
    return next(err);
  }
});
route.get('/bikes', async (req, res, next) => {
  const service = Container.get(StatisticsService);
  try {
    res.status(200).json(await service.getBikes());
  } catch (err) {
    return next(err);
  }
});

export default route;
