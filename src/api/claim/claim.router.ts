import { Router } from 'express';
import { controller } from './claim.controller';

let router = Router();

router.route('/')
    .get(controller.all);

router.route('/add')
    .post(controller.add);

router.route('/:code')
    .get(controller.get)
    .put(controller.update)
    .delete(controller.delete);

export let claimRouter = router;