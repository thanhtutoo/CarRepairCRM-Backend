import { Request, Response, NextFunction } from 'express';
import { Job, JobState } from '../../models/job';
import logger from '../../util/logger';
import { ResponseMessage } from '../constants';
import generator from '../../util/generator';
import { VehiclePart } from '../../models/vehicle_part';
import { Labour } from '../../models/labour';
import { Quote } from '../../models/quote';
import { User } from '../../models/user';

export let controller = {

    // get /api/jobs/
    all: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let jobs = await Job.primary_key.scan({limit: 100});
            res.json({status: ResponseMessage.OK, jobs: jobs.records});
        }
        catch (e) {
            logger.error(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // post /api/jobs/add
    add: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let job = new Job();
            job.id = generator.uniqueNumber();
            job.vehicle_reg = req.body.vehicle_reg;
            job.type = 'manual';
            job.state = req.body.state;
            job.state_id = req.body.state_id;
            job.state_details = req.body.state_details;
            job.descr = req.body.descr;
            job.app_code = req.body.app_code;

            let dealer = await User.primary_key.get(job.app_code);
            job.retailer = dealer.name;

            // job.state_id = JobState.getStateId(job.state);

            // let job_state = new JobState();
            // job_state.note = req.body.note;
            // job_state.date_at = new Date().toUTCString();

            // job.state_details = [job_state];

            job.created_at = new Date().toUTCString();
            job.updated_at = new Date().toUTCString();
            await job.save();

            res.json({status: ResponseMessage.OK, job: job});
        }
        catch (e) {
            logger.error(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },
    
    // get /api/jobs/:id
    get: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let job_id = Number(req.params['id']);
            let job = await Job.primary_key.get(job_id);
            let quote = await Quote.job_id_key.query(job_id);
            res.json({status: ResponseMessage.OK, job: job, quote: quote.records[0]});
        }
        catch (e) {
            logger.error(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // put /api/jobs/:id
    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let job_id = Number(req.params['id']);
            let job = await Job.primary_key.get(job_id);
            let job_data = req.body;
            // let vehicle_parts_data = req.body.vehicle_parts;
            // let labours_data = req.body.labours;

            job.vehicle_reg = job_data.vehicle_reg;
            job.type = job_data.type;
            job.state = job_data.state;
            job.state_id = job_data.state_id;
            job.state_details = job.state_details;
            //job.app_code = req.body.app_code;

            // job.state_id = JobState.getStateId(job.state);
            // job.state_details[job.state_id].note = req.body.note;
            // job.state_details[job.state_id].date_at = new Date().toUTCString();
            job.updated_at = new Date().toUTCString();
            await job.save();

            // console.log(vehicle_parts_data);
            // if (vehicle_parts_data) {
            //     vehicle_parts_data.forEach(async vehicle_part_data => {
            //         if (vehicle_part_data.id) {
            //             let vehicle_part = await VehiclePart.primary_key.get(job_id, vehicle_part_data.id);
            //             vehicle_part.job_id = job_id;
            //             vehicle_part.price = vehicle_part_data.price;
            //             vehicle_part.quantity = vehicle_part_data.quantity;
            //             vehicle_part.updated_at = new Date().toUTCString();
            //             await vehicle_part.save();
            //         }
            //         else {
            //             let vehicle_part = new VehiclePart();
            //             vehicle_part.id = generator.uniqueNumber();
            //             vehicle_part.job_id = job_id;
            //             vehicle_part.price = vehicle_part_data.price;
            //             vehicle_part.quantity = vehicle_part_data.quantity;
            //             vehicle_part.created_at = new Date().toUTCString();
            //             vehicle_part.updated_at = new Date().toUTCString();
            //             await vehicle_part.save();
            //         }
            //     });
            // }

            // console.log(labours_data);
            // if (labours_data) {
            //     labours_data.forEach(async labour_data => {
            //         if (labour_data.id) {
            //             let labour = await Labour.primary_key.get(job_id, labour_data.id);
            //             labour.job_id = job_id;
            //             labour.price = labour_data.price;
            //             labour.hours = labour_data.hours;
            //             labour.updated_at = new Date().toUTCString();
            //             await labour.save();
            //         }
            //         else {
            //             let labour = new Labour();
            //             labour.id = generator.uniqueNumber();
            //             labour.job_id = job_id;
            //             labour.price = labour_data.price;
            //             labour.hours = labour_data.hours;
            //             labour.created_at = new Date().toUTCString();
            //             labour.updated_at = new Date().toUTCString();
            //             await labour.save();
            //         }
            //     });
            // }

            res.json({status: ResponseMessage.OK});
        }
        catch (e) {
            logger.error(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // delete /api/jobs/:id
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let job_id = Number(req.params['id']);
            let job = await Job.primary_key.get(job_id);
            await job.delete();

            res.json({status: ResponseMessage.OK});
        }
        catch (e) {
            logger.error(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },


    // get /api/jobs/:id/quote
    getQuote: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let job_id = Number(req.params['id']);
            let quote = await Quote.job_id_key.query(job_id);
            res.json({status: ResponseMessage.OK, quote: quote.records[0]});
        }
        catch (e) {
            logger.error(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },
};
