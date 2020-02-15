import { Router } from 'express';
import { controller } from './garage.controller';

var multer = require('multer');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        console.log("#");
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        console.log("$");
        var datetimestamp = Date.now();
        cb(null, datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});
var upload = multer({ //multer settings
                storage: storage
            });

let router = Router();

router.route('/')
    .get(controller.all);

router.route('/add')
    .post(controller.add);

router.route('/:app_code')
    .get(controller.get)
    .put(controller.update)
    .delete(controller.delete);

router.route('/:app_code/vehicles')
    .get(controller.getVehicles);
router.route('/:app_code/users')
    .get(controller.getUsers);

router.route('/find_by_service')
    .post(controller.findByService)

router.route('/:app_code/set_services')
    .post(controller.setServices)

router.route('/:app_code/add_vehicle')
    .post(controller.addVehicle)
router.route('/:app_code/remove_vehicle')
    .post(controller.removeVehicle)
router.route('/upload')
    .post(upload.single('file'), controller.uploadPhoto)
    
export let garageRouter = router;