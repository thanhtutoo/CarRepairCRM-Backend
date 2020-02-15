import { Request, Response, NextFunction } from 'express';
import { Job, JobState } from '../../models/job';
import { Quote } from '../../models/quote';
import logger from '../../util/logger';
import { ResponseMessage } from '../constants';
import generator from '../../util/generator';
import { VehiclePart } from '../../models/vehicle_part';
import { Labour } from '../../models/labour';
import xApi from '../../util/ext_api';
import { Order } from '../../models/order';
import paymentApi from '../../util/pay';
import { User } from '../../models/user';
import { Notify } from '../../models/notify';

export let controller = {

    // get /api/quotes/
    all: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let quotes = await Quote.primary_key.scan({limit: 100});
            let orders = await Order.primary_key.scan({limit:100});
            res.json({status: ResponseMessage.OK, quotes: quotes.records, orders: orders.records});
        }
        catch (e) {
            logger.error(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // post /api/quotes/add
    add: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let quote = new Quote();

            quote.code = generator.postCode();
            quote.job_id = req.body.job_id;
            quote.parts_total = req.body.parts_total;
            quote.labour_total = req.body.labour_total;
            quote.au_parts_total = req.body.au_parts_total;
            quote.claim_total = req.body.claim_total;
            quote.vat_needed = req.body.vat_needed;
            quote.vat = req.body.vat;
            quote.app_code = req.body.app_code;
            quote.invoiced_total = req.body.invoiced_total;
            quote.labours = req.body.labours;
            quote.vehicle_parts = req.body.vehicle_parts;
            quote.created_at = new Date().toUTCString();
            quote.updated_at = new Date().toUTCString();

            await quote.save();

            res.json({status: ResponseMessage.OK, quote: quote});
        }
        catch (e) {
            logger.error(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },
    
    // get /api/quotes/:code
    get: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let quote_code = req.params['code'];
            let quote = await Quote.primary_key.get(quote_code);

            console.log(quote);
            if (quote) {
                res.json({status: ResponseMessage.OK, quote: quote});
            }
        }
        catch (e) {
            logger.error(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // put /api/quotes/:code
    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let quote_code = req.params['code'];
            let req_quote = req.body['quote'];

            let quote = await Quote.primary_key.get(quote_code);
            if (quote) {
                quote.job_id = req.body.job_id;
                quote.parts_total = req.body.parts_total;
                quote.labour_total = req.body.labour_total;
                quote.au_parts_total = req.body.au_parts_total;
                quote.claim_total = req.body.claim_total;
                quote.vat_needed = req.body.vat_needed;
                quote.vat = req.body.vat;
                quote.invoiced_total = req.body.invoiced_total;
                quote.labours = req.body.labours;
                quote.app_code = req.body.app_code;
                quote.vehicle_parts = req.body.vehicle_parts;
                quote.updated_at = new Date().toUTCString();

                await quote.save();
            }
            res.json({status: ResponseMessage.OK});
        }
        catch (e) {
            logger.error(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // delete /api/quotes/:code
    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let quote_code = req.params['code'];
            let quote = await Quote.primary_key.get(quote_code);
            await quote.delete();

            res.json({status: ResponseMessage.OK});
        }
        catch (e) {
            logger.error(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    sendQuote: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let quote_code = req.params['code'];
            let quote = await Quote.primary_key.get(quote_code);
            let job = await Job.primary_key.get(quote.job_id);

            let dealer = await User.primary_key.get(job.app_code);
            let user = await xApi.findUserByVehicle(job.vehicle_reg);
            let pdf_url = xApi.printQuote(job, quote, 'Quote', dealer, user);

            xApi.sendNotification2(job.app_code, job.vehicle_reg, "Quote Invoice", 
                "Quote Invoiced. Please look attach file and Accept please!", "quote", quote_code, pdf_url
            );
            
            res.json({status: ResponseMessage.OK});
        }
        catch (e) {
            logger.error(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }

    },

    acceptQuote: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let quote_code = req.params['code'];
            let quote = await Quote.primary_key.get(quote_code);
            let job = await Job.primary_key.get(quote.job_id);
            quote.is_invoiced = true;

            let dealer = await User.primary_key.get(job.app_code);
            let user = await xApi.findUserByVehicle(job.vehicle_reg);
            let pdf_url = xApi.printQuote(job, quote, 'Invoice', dealer, user);
            xApi.sendNotification2(job.app_code, job.vehicle_reg, "Accepted Quote", "Accepted and request a invoice.", "invoice", quote_code, pdf_url);
            xApi.sendNotification(job.vehicle_reg, job.app_code, "Accepted Quote", "Accepted a quote.");

            let noty_id = Number(req.body.notification_id);
            if (noty_id) {
                let noty = await Notify.primary_key.get(noty_id);
                noty.type = 'quote_accepted';
            }

            job.state = 'Quote Accepted';
            let sid = job.state_details.map( (s) => {return s.state;}).indexOf(job.state);
            if (sid >= 0) job.state_id = sid;
            
            await job.save();

            // let order = new Order();
            // order.id = generator.uniqueNumber();
            // order.job_id = quote.job_id;
            // order.app_code = quote.app_code;
            // order.quote_code = quote.code;
            // order.net = quote.labour_total + quote.parts_total;
            // order.vat = quote.vat;
            // order.total = quote.claim_total;
            // order.descr = job.descr;

            // if (quote.labours && quote.vehicle_parts) {
            //     order.quantity = quote.labours.length + quote.vehicle_parts.length;
            // }
            // else if (quote.labours) {
            //     order.quantity = quote.labours.length;
            // }
            // else if (quote.vehicle_parts) {
            //     order.quantity = quote.vehicle_parts.length;
            // }

            // await order.save();

            res.json( {status: ResponseMessage.OK} );
        }
        catch (e) {
            logger.log(e);
            res.json( {status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR} );
        }
    },

    rejectQuote: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let quote_code = req.params['code'];

            let quote = await Quote.primary_key.get(quote_code);
            let job = await Job.primary_key.get(quote.job_id);

            xApi.sendNotification(job.vehicle_reg, job.app_code, "Rejected Quote", "Rejected a quote. Please confirm with user.");

            let noty_id = Number(req.body.notification_id);
            if (noty_id) {
                let noty = await Notify.primary_key.get(noty_id);
                noty.type = 'quote_rejected';
            }

            job.state = 'Quote Rejected';
            let sid = job.state_details.map( (s) => {return s.state;}).indexOf(job.state);
            if (sid >= 0) job.state_id = sid;

            await job.save();

            res.json( {status: ResponseMessage.OK} );
        }
        catch (e) {
            logger.log(e);
            res.json( {status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR} );
        }
    },

    createPayment: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let quote_code = req.params['code'];

            let quote = await Quote.primary_key.get(quote_code);
            paymentApi.createPaypalPayment(quote.claim_total).then( 
                (data) => {
                    res.json( {id: data.id} );
                },
                
                (err) => {
                    res.sendStatus(500);
                }
            );
        }
        catch (e) {
            logger.log(e);
            res.json( {status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR} );
        }
    },

    executePayment: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let payment_id = req.body.paymentID;
            let payer_id = req.body.payerID;
            let quote_code = req.params['code'];
            let amount = req.body.amount;

            let quote = await Quote.primary_key.get(quote_code);
            let job = await Job.primary_key.get(quote.job_id);

            await paymentApi.executePaypalPayment(payment_id, payer_id, amount);

            quote.is_paid = true;
            await quote.save();

            let noty_id = Number(req.params["notification_id"]);
            if (noty_id) {
                let noty = await Notify.primary_key.get(noty_id);
                noty.type = 'invoice_paid';
                await noty.save();
            }

            job.state = 'Paid';
            let sid = job.state_details.map( (s) => {return s.state;}).indexOf(job.state);
            if (sid >= 0) job.state_id = sid;
            await job.save();

            res.json({status: ResponseMessage.OK});
        }
        catch (e) {
            logger.log(e);

            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    stripePay: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let token = req.body.token;
            let quote_code = req.params['code'];
            let amount = req.body.amount;

            let quote = await Quote.primary_key.get(quote_code);

            let ret = await paymentApi.stripePayment(token, amount);

            if (ret.status == 'succeeded' && ret.amount == amount) {
                quote.is_paid = true;
                await quote.save();

                res.json({status: ResponseMessage.OK});
            }
            else {
                res.json({status: ResponseMessage.FAILED_STRIPE_PAY});
            }
        }
        catch (e) {
            logger.log(e);

            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    }
};
