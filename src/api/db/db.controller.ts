import { Request, Response, NextFunction } from 'express';
import { User } from '../../models/user';
import logger from '../../util/logger';
import { Garage } from '../../models/garage';
import { ResponseMessage } from '../constants';
import { createDatabase, destroyDatabase } from '../../db/migrate';

export let controller = {

    // Dealer Login
    // post /api/auth/login_dealer
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await createDatabase();

            res.json({status: ResponseMessage.OK});
        }catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // post /api/auth/login_user
    destroy: async (req: Request, res: Response, next: NextFunction) => {
        // req.body.app_code
        try {
            await destroyDatabase();

            res.json({status: ResponseMessage.OK});
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    }
};
