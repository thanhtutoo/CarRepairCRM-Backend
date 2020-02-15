import { Request, Response, NextFunction } from 'express';
import { Notify } from '../../models/notify';
import { ResponseMessage } from '../constants';

export let controller = {

    // get /api/notifications/
    all: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let notifications = await Notify.primary_key.scan({limit: 100});
            res.json({status: ResponseMessage.OK, notifications: notifications.records});
        }
        catch (e) {
            console.log(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // post /api/notifications/add
    add: async (req: Request, res: Response, next: NextFunction) => {
        let notification = new Notify();

        notification.created_at = new Date().toUTCString();
        notification.updated_at = new Date().toUTCString();
        notification.readen_at = null;
        notification.readen = false;
        
        notification.to_email = req.body.to_email;
        notification.message = req.body.message;

        await notification.save();

        res.json({status: ResponseMessage.OK, notification: notification});
    },
    
    // get /api/user/:id
    get: async (req: Request, res: Response, next: NextFunction) => {
        let notification = await Notify.primary_key.get(Number(req.params["id"]));
        res.json({status: ResponseMessage.OK, notification: notification});
    },

    // put /api/user/:id
    update: async (req: Request, res: Response, next: NextFunction) => {
        let notification = await Notify.primary_key.get(Number(req.params["id"]));

        notification.updated_at = new Date().toUTCString();
        notification.readen_at = new Date().toUTCString();
        notification.readen = true;
        notification.to_email = req.body.to_email;
        notification.message = req.body.message;

        await notification.save();

        res.json({status: ResponseMessage.OK});
    },

    // delete /api/user/:id
    delete: async (req: Request, res: Response, next: NextFunction) => {
        let notification = await Notify.primary_key.get(Number(req.params["id"]));
        await notification.delete();

        res.json({status: ResponseMessage.OK});
    },

    markAsRead: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let notification = await Notify.primary_key.get(Number(req.params["id"]));
            notification.readen = true;
            notification.readen_at = new Date().toUTCString();
            notification.updated_at = new Date().toUTCString();
            await notification.save();
    
            res.json({status: ResponseMessage.OK});
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },
};
