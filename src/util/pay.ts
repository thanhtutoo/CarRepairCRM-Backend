import config from '../config';
import * as request from 'request-promise-native';
import logger from './logger';
var stripe = require("stripe")("sk_test_8q0pzj3fdCZ6fgBtcDnfgfGb");

const PAYPAL_URL = "https://api.sandbox.paypal.com/v1/payments/payment/";
const PAYPAL_CLIENT = "AYSiTZHEnnSZQAyC4UudSj2sUYhIzgWwp1P4cgl8gvvb3jAf2RM6NvMESLEAxqDJ4_aZRSb-Rt2jfVSW";
const PAYPAL_SECRET = "ENtW3Ir627mTDXyGR48wJhlBLrcrdyK6qWt54UqwYXGYYSLZ_Lx6NOircMbjmMsFG_ikN30yl4VYhBtz";

let paymentApi = {
    createPaypalPayment : async (amount) => {
        let currency = 'USD';
        let pay_data = {
            auth: {
                user: PAYPAL_CLIENT,
                pass: PAYPAL_SECRET
            },
            body: {
                intent: 'sale',
                payer: {
                    payment_method: 'paypal'
                },

                transactions: [
                    {amount: {total: amount, currency: currency}}
                ],

                redirect_urls: {
                    return_url: '/login',
                    cancel_url: '/login'
                }
            },
            json: true
        };

        return request.post( PAYPAL_URL, pay_data);
    },

    executePaypalPayment : async (payment_id, payer_id, amount) => {
        let currency = 'USD';
        let pay_data = {
            auth: {
                user: PAYPAL_CLIENT,
                pass: PAYPAL_SECRET
            },
            body: {
                payer_id: payer_id,
                transactions: [
                    {amount: {total: amount, currency: currency}}
                ]
            },
            json: true
        };

        console.log(pay_data);

        return request.post( PAYPAL_URL + payment_id + "/execute", pay_data);
    },

    stripePayment : async (token, amount) => {
        let charge = stripe.charges.create({
            amount: amount,
            currency: 'usd',
            description: 'AU Warranty',
            source: token,
        });
        return charge;
    },
    
    
  };
  
  export default paymentApi;
