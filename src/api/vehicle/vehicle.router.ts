import { Router } from 'express';
import { controller } from './vehicle.controller';

let router = Router();

router.route('/:reg_no')
    .get(controller.get)

router.route('/:reg_no/mileages')
    .get(controller.getMileages)
router.route('/:reg_no/job')
    .get(controller.getJob)
router.route('/:reg_no/data')
    .get(controller.getData)    
router.route('/:reg_no/tax')
    .get(controller.getTax)
router.route('/:reg_no/warranty')
    .post(controller.bookWarrantyQuote)

export let vehicleRouter = router;