import { Request, Response, NextFunction } from 'express';
import { Reminder } from '../../models/reminder';
import { ResponseMessage } from '../constants';
import generator from '../../util/generator';

export let controller = {

    // get /api/reminders/
    all: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let reminders = await Reminder.primary_key.scan({limit: 100});

            res.json({status: ResponseMessage.OK, reminders: reminders.records});
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // post /api/reminders/add
    add: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let reminder = new Reminder();

            reminder.id = generator.uniqueNumber();
            reminder.name = req.body.name;
            reminder.enabled = req.body.enabled;
            reminder.trigger_month = req.body.month;
            reminder.trigger_day = req.body.day;
            reminder.trigger_hour = req.body.hour;
            reminder.trigger_minute = req.body.minute;
            reminder.trigger_second = req.body.second;
            reminder.vehicle_reg = req.body.reg_no;
            reminder.descr = req.body.descr;
            reminder.created_at = new Date().toUTCString();
            reminder.updated_at = new Date().toUTCString();

            await reminder.save();
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },
    
    // get /api/reminders/:id
    get: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let id = Number(req.params['id']);
            let reminder = await Reminder.primary_key.get(id);

            res.json({status: ResponseMessage.OK, reminder: reminder});
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // put /api/reminders/:id
    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let id = Number(req.params['id']);
            let reminder = await Reminder.primary_key.get(id);

            reminder.name = req.body.name;
            reminder.enabled = req.body.enabled;            
            reminder.trigger_month = req.body.month;
            reminder.trigger_day = req.body.day;
            reminder.trigger_hour = req.body.hour;
            reminder.trigger_minute = req.body.minute;
            reminder.trigger_second = req.body.second;
            reminder.updated_at = new Date().toUTCString();
            await reminder.save();

            res.json({status: ResponseMessage.OK});
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // delete /api/reminders/:id
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let id = Number(req.params['id']);
            let reminder = await Reminder.primary_key.get(id);
            await reminder.delete();

            res.json({status: ResponseMessage.OK});
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },
};
