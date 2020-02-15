import { Router } from 'express';
import { controller } from './service.controller';

let router = Router();

router.route('/')
    .get(controller.all)
router.route('/self_service')
    .post(controller.getSelfService)
router.route('/repair')
    .post(controller.reqRepair)
router.route('/book_mot')
    .post(controller.bookMot)
router.route('/book_service')
    .post(controller.bookService)
router.route('/claim')
    .post(controller.reqClaim)

export let serviceRouter = router;