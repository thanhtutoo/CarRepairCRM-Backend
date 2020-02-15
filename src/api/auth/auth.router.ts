import { Router } from 'express';
import { controller } from './auth.controller';

let router = Router();

// App base api
router.route('/login_dealer')
    .post(controller.loginAsDealer);
router.route('/login_user')
    .post(controller.loginAsUser);    
// Web base api
router.route('/login')
    .post(controller.login);

router.route('/forgot')
    .post(controller.forgot);


export let authRouter = router;