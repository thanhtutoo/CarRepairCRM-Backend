import { Request, Response, NextFunction, Express } from 'express';
import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import { default as config, ENV } from '../config';
import logger from '../util/logger';

export function appMiddleware(app: Express) {
    return (req: Request, res: Response, next: NextFunction) => {
        // Check api key first.
        // if (false && req.header('Authorization') === 'Bearer fake-jwt-token') {
        // //if (false && req.header(config.api_key) != config.api_password) {
        //     res.status(401).send("Request authorization failed.");
        // }
        // else 
        {
            // Serve static server only in production mode. In any other modes, treat this as a standalone API server.
            if (config.environment === ENV.prod) {
                app.use(express.static(path.join(__dirname, '../../../../client/dist')));
            }
            
            next();
        }
    }
}
