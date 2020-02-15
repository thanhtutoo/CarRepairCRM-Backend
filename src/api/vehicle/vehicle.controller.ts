import { Request, Response, NextFunction } from 'express';
import { User } from '../../models/user';
import xApi from '../../util/ext_api';
import { ResponseMessage } from '../constants';
import { Job, JobState } from '../../models/job';
import { Vehicle } from "../../models/vehicle";
import logger from '../../util/logger';
import { Warranty } from '../../models/warranty';
import generator from '../../util/generator';
import { Notify } from '../../models/notify';
import { Reminder } from '../../models/reminder';
import { Policy } from '../../models/policy';

export let controller = {
    // get /api/vehicles/:reg_no
    get: async (req: Request, res: Response, next: NextFunction) => {
        // TODO:
        //  1. Check user role to determine permission.
        //  2. Get and return user has id.
        try {
            
            logger.log(req.params['reg_no']);
            let x_vehicle = await xApi.getVehicle(req.params['reg_no']);
            let vehicle = Vehicle.fromJson(JSON.parse(x_vehicle));

            res.json({status: ResponseMessage.OK, vehicle: vehicle});
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // get /api/vehicles/:reg_no/mileages
    getMileages: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let x_vehicle = await xApi.getVehicle(req.params['reg_no']);
            let vehicle = Vehicle.fromJson(JSON.parse(x_vehicle));

            let mileages = [];
            vehicle.mots.forEach( (mot) => {
                if (mot.expiry_at) {
                    let expiry_at = new Date(mot.expiry_at);

                    if (expiry_at) {
                        mileages.push({
                            year: expiry_at.getFullYear(), 
                            mileage: mot.odometer, 
                            test_at: mot.test_at, 
                            expired_at: mot.expiry_at}
                        );
                    }
                }
            });

            res.json({status: ResponseMessage.OK, mileages: mileages});
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // get /api/vehicles/:reg_no/job
    getJob: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let reg_no = req.params['reg_no'];
            let jobs = await Job.vehicle_reg_key.query(reg_no);

            if (jobs.count > 0) {
                res.json({status: ResponseMessage.OK, job: jobs.records[0]});
            }
            else {
                res.json({status: ResponseMessage.NOT_FOUND_JOB});
            }
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
        
    },

    // get /api/vehicles/:reg_no/data
    getData: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let reg_no = req.params['reg_no'];
            let jobs = await Job.vehicle_reg_key.query(reg_no);
            let reminders = await Reminder.vehicle_reg_key.query(reg_no);

            if (jobs.count > 0) {
                res.json({status: ResponseMessage.OK, jobs: jobs.records, reminders: reminders.records});
            }
            else if (reminders.count > 0) {
                res.json({status: ResponseMessage.OK, reminders: reminders.records});
            }
            else {
                res.json({status: ResponseMessage.NOT_FOUND_JOB});
            }
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
        
    },

    // get /api/vehicles/:reg_no/tax
    getTax: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let reg_no = req.params['reg_no'];
            res.json({
                status: ResponseMessage.OK,
                tax_rules: [
                    {ved_band: 'A', co2: '100g/km', rate: '£0'},
                    {ved_band: 'B', co2: '110g/km', rate: '£20'},
                    {ved_band: 'C', co2: '120g/km', rate: '£30'},
                    {ved_band: 'D', co2: '130g/km', rate: '£110'},
                    {ved_band: 'E', co2: '140g/km', rate: '£130'},
                    {ved_band: 'F', co2: '150g/km', rate: '£145'},
                    {ved_band: 'G', co2: '165g/km', rate: '£185'},
                    {ved_band: 'H', co2: '175g/km', rate: '£210'},
                    {ved_band: 'I', co2: '185g/km', rate: '£230'},
                    {ved_band: 'J', co2: '200g/km', rate: '£270'},
                    {ved_band: 'K', co2: '225g/km', rate: '£295'},
                    {ved_band: 'K', co2: '255g/km', rate: '£500'},
                    {ved_band: 'K', co2: 'Over 255g/km', rate: '£515'},
                ]
            });
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
        
    },

    bookWarrantyQuote: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let reg_no = req.params['reg_no'];
            
            let warranty = new Warranty();
            warranty.periods = req.body.periods;
            warranty.mileage = req.body.mileage;
            warranty.services = req.body.services;
            warranty.id = generator.uniqueNumber();
            warranty.app_code = req.body.app_code;
            warranty.vehicle_reg = reg_no;

            warranty.created_at = new Date().toUTCString();
            warranty.updated_at = new Date().toUTCString();

            await warranty.save();

            let user = await User.primary_key.get(warranty.app_code);

            let notify =  controller.createNotification(warranty.app_code, 'AUADMIN01', "Warranty Quote", "Request warranty quote");
            await notify.save();

            //xApi.sendNotification2('AUADMIN01', reg_no, "Warranty Quote", "Warranty Quotation", 'warranty_quote', '', '');
            notify = controller.createNotification('AUADMIN01', warranty.app_code, "Warranty Quote", "Warranty quotation");


            ////////////////////////////////////////////
            // Add policy
            ////////////////////////////////////////////
            let policies = await Policy.primary_key.query( {hash: reg_no, rangeOrder: "DESC", limit: 1} );
            let policy_no = 1;
            if (policies.count > 0) {
                policy_no = policies.records[0].policy_no + 1;
            }
            let policy = new Policy();
            policy.id = generator.uniqueNumber();
            policy.level = 'Basic';
            policy.vehicle_reg = reg_no;
            policy.policy_no = policy_no;
            policy.name = policy.vehicle_reg + policy.policy_no;
            policy.created_at = new Date().toUTCString();
            policy.updated_at = new Date().toUTCString();
            await policy.save();
            ////////////////////////////////////////////

            res.json({status: ResponseMessage.OK});
        }
        catch (e) {
            console.log(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    createNotification : (from_app_code:string, to_app_code: string, subject: string, message: string) => {
        let notify = new Notify();
        notify.id = generator.uniqueNumber();
        notify.from_app_code = from_app_code;
        notify.subject = subject;
        notify.to_app_code = to_app_code;
        notify.message = message;
        notify.created_at = new Date().toUTCString();
        notify.updated_at = new Date().toUTCString();
        
        return notify;
    }
};

