import { Router } from 'express';
import { sharedRouter } from './shared/shared.router';
import { authRouter } from './auth/auth.router';
import { userRouter } from './user/user.router';
import { garageRouter } from './garage/garage.router';
import { jobRouter } from './job/job.router';
import { claimRouter } from './claim/claim.router';
import { notifyRouter } from './notify/notify.router';
import { reminderRouter } from './reminder/reminder.router';
import { vehicleRouter } from './vehicle/vehicle.router';
import { quoteRouter } from './quote/quote.router';
import { dbRouter } from './db/db.router';
import { serviceRouter } from './service/service.router';
import { uploadRouter } from './upload/upload.router';


let router = Router();

router.use('/shared', sharedRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/garages', garageRouter);
router.use('/jobs', jobRouter);
router.use('/claims', claimRouter);
router.use('/notifications', notifyRouter);
router.use('/reminders', reminderRouter);
router.use('/vehicles', vehicleRouter);
router.use('/quotes', quoteRouter);
router.use('/db', dbRouter);
router.use('/services', serviceRouter);
router.use('/uploads', uploadRouter);

export let apiRouter = router;

