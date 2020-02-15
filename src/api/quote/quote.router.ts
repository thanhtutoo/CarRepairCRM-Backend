import { Router } from 'express';
import { controller } from './quote.controller';

let router = Router();

router.route('/')
    .get(controller.all);

router.route('/add')
    .post(controller.add);

router.route('/:code')
    .get(controller.get)
    .put(controller.update)
    .delete(controller.delete);

router.route('/:code/send')
    .get(controller.sendQuote);

router.route('/:code/accept')
    .post(controller.acceptQuote);
router.route('/:code/reject')
    .post(controller.rejectQuote);
router.route('/:code/create_pay/:notification_id')
    .post(controller.createPayment);
router.route('/:code/execute_pay/:notification_id')
    .post(controller.executePayment);
router.route('/:code/stripe_pay/:notification_id')
    .post(controller.stripePay);    
export let quoteRouter = router;