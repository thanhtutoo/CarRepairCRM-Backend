import { Router } from 'express';
import { controller } from './job.controller';

let router = Router();

router.route('/')
    .get(controller.all);

router.route('/add')
    .post(controller.add);

router.route('/:id')
    .get(controller.get)
    .put(controller.update)
    .delete(controller.delete);

router.route('/:id/quote')
    .get(controller.getQuote)

export let jobRouter = router;