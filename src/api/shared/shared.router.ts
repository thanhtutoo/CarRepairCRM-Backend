import { Router } from 'express';
import { controller } from './shared.controller';

let router = Router();

router.route('/ved_bands')
    .get(controller.getVedBands);
router.route('/setting')
    .get(controller.getSetting);

export let sharedRouter = router;