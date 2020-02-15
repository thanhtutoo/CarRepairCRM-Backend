import { Router } from 'express';
import { controller } from './user.controller';

let router = Router();

router.route('/')
    .get(controller.all);

router.route('/add')
    .post(controller.add);
router.route('/gen_code')
    .post(controller.generatePostCode);

router.route('/:app_code')
    .get(controller.get)
    .put(controller.update)
    .delete(controller.delete);

router.route('/:app_code/notifications')
    .get(controller.getNotifications);
router.route('/:app_code/add_vehicle')
    .post(controller.addVehicle);
router.route('/:app_code/remove_vehicle')
    .post(controller.removeVehicle);
router.route('/:app_code/vehicles')
    .get(controller.getVehicles);
router.route('/:app_code/add_reminder')
    .post(controller.addReminder);
router.route('/:app_code/remove_reminder')
    .post(controller.removeReminder);
router.route('/:app_code/reminders')
    .post(controller.getReminders);
router.route('/:app_code/enable_reminder')
    .post(controller.enableReminders);    
router.route('/:app_code/summary')
    .get(controller.getSummary);
router.route('/:app_code/pricing')
    .get(controller.getPricing);
router.route('/:app_code/price')
    .put(controller.updatePrice);
router.route('/:app_code/find')
    .post(controller.findUser);
router.route('/:app_code/find_all')
    .post(controller.findUsers);
router.route('/:app_code/send')
    .post(controller.sendNotification);
router.route('/:app_code/jobs')
    .post(controller.findJobs);
router.route('/:app_code/find_by_vehicle')
    .post(controller.findUserByVehicle);
router.route('/:app_code/orders')
    .get(controller.getOrders);
export let userRouter = router;
