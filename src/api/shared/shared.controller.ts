import { Request, Response, NextFunction } from 'express';
import { ResponseMessage } from '../constants';
import { Garage } from '../../models/garage';
import { User } from '../../models/user';

export let controller = {

    // post /api/shared/ved_bands
    getVedBands: async (req: Request, res: Response, next: NextFunction) => {
        res.json({status: 'Not implemented yet.'});
    },

    getSetting: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let admin = await User.primary_key.get('AUADMIN01');
            if (admin) {
                res.json({status: ResponseMessage.OK, color: admin.color, image_url: admin.image_url});
            }
            else {
                res.json({status: ResponseMessage.OK});
            }
            
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // post /api/auth/forgot
    forgot: (req: Request, res: Response, next: NextFunction) => {
        res.json({ok: true});
    },
};
