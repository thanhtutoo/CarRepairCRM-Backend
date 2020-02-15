import { Router } from 'express';
import { controller } from './notify.controller';

let router = Router();

router.route('/')
    .get(controller.all);

router.route('/add')
    .post(controller.add);

router.route('/:id')
    .get(controller.get)
    .put(controller.update)
    .delete(controller.delete);
router.route('/:id/mark_as_read')
    .get(controller.markAsRead)

export let notifyRouter = router;