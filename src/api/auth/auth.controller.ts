import { Request, Response, NextFunction } from 'express';
import { User, UserRole } from '../../models/user';
import logger from '../../util/logger';
import { Garage } from '../../models/garage';
import { ResponseMessage } from '../constants';
import generator from '../../util/generator';
import { userInfo } from 'os';

export let controller = {

    // Dealer Login
    // post /api/auth/login_dealer
    loginAsDealer: async (req: Request, res: Response, next: NextFunction) => {
        // TODO:
        //  1. Check user role to determine permission.
        //  2. Get and return user info.

        // Request Data
        //      req.body.app_code;
        //      req.body.password;

        try {
            let user = await User.primary_key.get(req.body.app_code);

            if (user && user.isDealer() && user.password == req.body.password) {
                res.json({status: ResponseMessage.OK, user: user});
            }
            else {
                res.json({status: ResponseMessage.AUTHORIZATION_FAILED});
            }
        }catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // post /api/auth/forgot
    forgot: (req: Request, res: Response, next: NextFunction) => {
        // TOOD:
        //  1. Register user.
        //  2. Email to user.

        res.json({ok: true});
    },

    // post /api/auth/login_user
    loginAsUser: async (req: Request, res: Response, next: NextFunction) => {
        // req.body.app_code
        // req.body.client_code
        try {
            let app_code = req.body.app_code;           // this is garage or self code from AU
            let client_code = req.body.client_code;     // this is unique client code

            let parent = await User.primary_key.get(app_code);

            if (parent) {
                console.log(client_code);
                if (client_code && client_code != '') {
                    let user = await User.primary_key.get(client_code);
                    let garage = await Garage.primary_key.get(app_code);
                    
                    console.log(user.parent_app_code, app_code);
                    if (user && user.parent_app_code == app_code) {
                        res.json({status: ResponseMessage.OK, garage: garage, user: user});
                    }
                    else {
                        res.json({status: ResponseMessage.AUTHORIZATION_FAILED});
                    }
                }
                else {
                    // new user
                    let garage = await Garage.primary_key.get(app_code);

                    if (parent.isDealer() || parent.isAdmin()) {
                        let user  = new User();
                        //user.postal_code = '';
                        user.parent_app_code = app_code;
                        user.app_code = generator.unique7Digits();

                        user.role = UserRole.USER_CUSTOMER;
    
                        user.created_at = new Date().toUTCString();
                        user.updated_at = new Date().toUTCString();
                        user.last_used_at = new Date().toUTCString();
    
                        await user.save();

                        res.json({status: ResponseMessage.OK, garage: garage, user: user, client_code: user.app_code});
                    }
                    else {
                        // in this case, parent && user is same. so return app_code as client_code.
                        //res.json({status: ResponseMessage.OK, garage: garage, user: parent, client_code: parent.app_code});
                        res.json({status: ResponseMessage.AUTHORIZATION_FAILED});
                    }
                }
            }
            else {
                res.json({status: ResponseMessage.NOT_FOUND_USER});
            }
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // post /api/auth/login
    login: async (req: Request, res: Response, next: NextFunction) => {
        // TODO:
        //  1. Check user role to determine permission.
        //  2. Get and return user info.

        // Request Data
        //      req.body.app_code;
        //      req.body.password;

        try {
            
            let user = await User.primary_key.get(req.body.app_code);

            console.log('password', user.password);
            if (user && (!user.password || user.password == req.body.password)) {
                res.json({status: ResponseMessage.OK, user: user, token: 'fake-jwt-token'});
            }
            else {
                res.json({status: ResponseMessage.AUTHORIZATION_FAILED});
            }
        }catch (e) {
            console.log(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    }
};
