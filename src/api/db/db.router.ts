import { Router } from 'express';
import { controller } from './db.controller';

let router = Router();

router.route('/create')
    .post(controller.create);
router.route('/destroy')
    .post(controller.destroy);

export let dbRouter = router;