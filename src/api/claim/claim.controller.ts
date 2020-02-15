import { Request, Response, NextFunction } from 'express';
import { Claim } from '../../models/claim';
import { ResponseMessage } from '../constants';
import generator from '../../util/generator';
import logger from '../../util/logger';


/**
 * This is not used.!!!!!!!!!!!!
 * 
 */
export let controller = {

    // get /api/claims/
    all: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let claims = await Claim.primary_key.scan({limit: 100});
            res.json({status: ResponseMessage.OK, claims: claims.records});
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // post /api/claims/add
    add: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // req.body.app_code
            // req.body.vehicle_reg
            // req.body.vehicle_policy_no
            // req.body.descr
            // req.body.mileage

            let claim = new Claim();
            claim.code = generator.postCode();
            claim.app_code = req.body.app_code;
            claim.vehicle_reg = req.body.vehicle_reg;
            claim.vehicle_diagnosed_before = req.body.vehicle_diagnosed_before;
            claim.claim_registered_before = req.body.claim_registered_before;
            claim.descr = req.body.descr;
            claim.mileage = req.body.mileage;
            claim.created_at = new Date().toUTCString();
            claim.updated_at = new Date().toUTCString();

            await claim.save();

            res.json({status: ResponseMessage.OK, claim: claim});
        }
        catch (e) {
            logger.error(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },
    
    // get /api/claims/:code
    get: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let claim_code = req.params['code'];
            let claim = await Claim.primary_key.get(claim_code);

            res.json({status: ResponseMessage.OK, claim: claim});
        }
        catch (e) {
            logger.error(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // put /api/claims/:code
    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            // req.body.app_code
            // req.body.vehicle_reg
            // req.body.vehicle_policy_no
            // req.body.descr
            // req.body.mileage

            let claim_code = req.params['code'];
            let claim = await Claim.primary_key.get(claim_code);
            
            claim.vehicle_reg = req.body.vehicle_reg;
            claim.vehicle_diagnosed_before = req.body.vehicle_diagnosed_before;
            claim.claim_registered_before = req.body.claim_registered_before;
            claim.descr = req.body.descr;
            claim.mileage = req.body.mileage;

            claim.updated_at = new Date().toUTCString();

            await claim.save();

            res.json({status: ResponseMessage.OK});
        }
        catch (e) {
            logger.log(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // delete /api/claims/:code
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let claim_code = req.params['code'];
            let claim = await Claim.primary_key.get(claim_code);
            await claim.delete();
            res.json({status: ResponseMessage.OK});
        }
        catch (e) {
            logger.error(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },
};
