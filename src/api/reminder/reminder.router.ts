import { Router } from 'express';
import { controller } from './reminder.controller';

let router = Router();

router.route('/')
    .get(controller.all);

router.route('/add')
    .post(controller.add);

router.route('/:id')
    .get(controller.get)
    .put(controller.update)
    .delete(controller.delete);

export let reminderRouter = router;