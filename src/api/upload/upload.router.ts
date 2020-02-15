import { Router } from 'express';
import { controller } from './upload.controller';

let router = Router();

router.route('/:filename')
    .get(controller.getUpload)
    
export let uploadRouter = router;