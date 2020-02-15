import config from '../config';
import * as request from 'request-promise-native';
import logger from './logger';
import { VehicleUser } from '../models/vehicle_user';
import { User } from '../models/user';
import { Notify } from '../models/notify';
import generator from './generator';
import { Summary } from '../models/summary';
import { Quote } from '../models/quote';
import { Job } from '../models/job';
import { Garage } from '../models/garage';
var pdf = require('html-pdf');
var path = require('path');
var fs = require("fs");

const XAPI_HOST="https://www.getvehiclesmart.com/rest/";
const GOOGLE_API_HOST="https://maps.googleapis.com";
const GOOGLE_API_KEY ="AIzaSyAxbKpNVHpiGeaMQPulIu4CESkuScJ5izk";

let xApi = {
    getApiUrl : function (sub_path) {

        return XAPI_HOST + sub_path + '&appid=auw-h4cTs3m6qaS1dd45Hb72&isRefreshing=false';
    },

    getVehicle : async function (vehicle_reg) {
        return request.get({url: this.getApiUrl('vehicleData?reg='+vehicle_reg)});
    },

    getGeoLocation : async function (postal_code) {
        let geoloc_str = await request.get({url: GOOGLE_API_HOST + '/maps/api/geocode/json?address='+postal_code+'&key='+GOOGLE_API_KEY});
        let geoloc = JSON.parse(geoloc_str);
        if (geoloc && geoloc['status'] == 'OK') {
            console.log('results', geoloc['results']);
            if (geoloc['results'] && geoloc['results'].length > 0) {
                return {address: geoloc['results'][0]['formatted_address'],
                        lat: geoloc['results'][0]['geometry']['location']['lat'],
                        lon: geoloc['results'][0]['geometry']['location']['lng']};
            }
        }
        return null;
    },

    addNotification : async function () {
        
    },

    findUser : async function (app_code) {
        try {
            let dealer = await User.primary_key.get(app_code);
            return dealer;
        }
        catch (e) {
            logger.error(e);
            return null;
        }
    },

    findUserCodeByVehicle : async function(vehicle_reg) {
        try {
            let vehicle_user = await VehicleUser.primary_key.get(vehicle_reg);
            if (vehicle_user) return vehicle_user.app_code;
            else return null;
        }
        catch (e) {
            logger.error(e);
            return null;
        }
    },

    findUserByVehicle : async function (vehicle_reg) {
        try {
            let vehicle_user = await VehicleUser.primary_key.get(vehicle_reg);
            let user = await User.primary_key.get(vehicle_user.app_code);
            return user;
        }
        catch (e) {
            logger.error(e);
            return null;
        }
    },

    getNotificationSubject : function (title, code) {
        return (title + " Reg No: " + code);
    },

    sendNotification : async function (vehicle_reg, dealer_code, subject, message) {
        let dealer = await xApi.findUser(dealer_code);
        let user_app_code = await xApi.findUserCodeByVehicle(vehicle_reg);
    
        console.log('User Post Code ', user_app_code);


        let notify = new Notify();
        notify.id = generator.uniqueNumber();
        notify.from_app_code = user_app_code;
        notify.to_email = dealer.email;
        notify.to_app_code = dealer_code;
        notify.subject = subject;
        notify.message = message;
        notify.created_at = new Date().toUTCString();
        notify.updated_at = new Date().toUTCString();
        await notify.save();
    },

    sendNotification2 : async function (from_app_code, to_vehicle_reg, subject, message, type, quote_code, attachment) {
        let user = await xApi.findUserByVehicle(to_vehicle_reg);
    
        if (user) {
            let notify = new Notify();
            notify.id = generator.uniqueNumber();
            notify.from_app_code = from_app_code;
            notify.to_email = user.email;
            notify.to_app_code = user.app_code;
            notify.subject = subject;
            notify.message = message;
            if (quote_code) notify.quote_code = quote_code;
            if (attachment) notify.attachment = attachment;
            if (type)       notify.type = type;

            notify.created_at = new Date().toUTCString();
            notify.updated_at = new Date().toUTCString();
            await notify.save();
        }
    },

    sendNotification3 : async function (from_app_code, to_app_code, subject, message) {
        let user = await User.primary_key.get(to_app_code);
    
        if (user) {
            let notify = new Notify();
            notify.id = generator.uniqueNumber();
            notify.from_app_code = from_app_code;
            notify.to_email = user.email;
            notify.to_app_code = user.app_code;
            notify.subject = subject;
            notify.message = message;
            notify.created_at = new Date().toUTCString();
            notify.updated_at = new Date().toUTCString();
            await notify.save();
        }
    },

    getValid : function(v, d) {
        return v? v:d;
    },

    // attr : 'booked_mots' | 'booked_repairs' | 'booked_services' | 'due_mots' | 'due_services' | 'availables'
    updateSummary : async function (dealer_code:string, date_str: string, attr: string) {
        let date = new Date(date_str);
        let key = date.getFullYear() +"-"+ date.getMonth();

        let summary = await Summary.primary_key.get(dealer_code, key);
        let garage = await Garage.primary_key.get(dealer_code);

        if (summary) {
            let v = summary.getAttribute(attr);
            if (v) {
                summary.setAttribute(attr, 1);
            }
            else {
                summary.setAttribute(attr, v+1);
            }

            if (garage) {
                summary.availables = xApi.getValid(garage.user_vehicle_count, 0);
                summary.booked_availables = xApi.getValid(garage.user_vehicle_count, 0) - 
                xApi.getValid(summary.booked_mots, 0) - 
                xApi.getValid(summary.booked_repairs, 0) -
                xApi.getValid(summary.booked_services, 0);
            }

            summary.updated_at = new Date().toUTCString();
            await summary.save();
        }
        else {
            summary = new Summary();
            summary.app_code = dealer_code;
            summary.year_month = key;
            summary.setAttribute(attr, 1);

            summary.created_at = new Date().toUTCString();
            summary.updated_at = new Date().toUTCString();

            if (garage) {
                summary.availables = xApi.getValid(garage.user_vehicle_count, 0);
                summary.booked_availables = xApi.getValid(garage.user_vehicle_count, 0) - 
                xApi.getValid(summary.booked_mots, 0) - 
                xApi.getValid(summary.booked_repairs, 0) -
                xApi.getValid(summary.booked_services, 0);
            }

            await summary.save();
        }

        let au_summary = await Summary.primary_key.get('AUADMIN01', key);
        if (au_summary) {
            let v = au_summary.getAttribute(attr);
            if (v) {
                au_summary.setAttribute(attr, 1);
            }
            else {
                au_summary.setAttribute(attr, v+1);
            }
            au_summary.updated_at = new Date().toUTCString();

            if (garage) {
                au_summary.availables += xApi.getValid(au_summary.availables, 0);
                au_summary.booked_availables += xApi.getValid(au_summary.booked_availables, 0);
            }


            await au_summary.save();
        }
        else {
            au_summary = new Summary();
            au_summary.app_code = 'AUADMIN01';
            au_summary.year_month = key;
            au_summary.setAttribute(attr, 1);

            au_summary.created_at = new Date().toUTCString();
            au_summary.updated_at = new Date().toUTCString();

            if (garage) {
                au_summary.availables = xApi.getValid(summary.availables, 0);
                au_summary.booked_availables = xApi.getValid(summary.booked_availables, 0);
            }
            
            await au_summary.save();
        }

    },

    printQuote: function (job: Job, quote: Quote, title: string, dealer: User, user: User) {

        let part_content='';
        let labour_content='';

        let getValid = function(v) {
            if (v) return v;
            return '';
        }

        if (quote.vehicle_parts) {
            quote.vehicle_parts.forEach( (part) => {
                part_content += 
                    '<tr>' +
                        '<td>' + getValid(part.id) + '</td>'+
                        '<td>' + getValid(part.quantity) + '</td>'+
                        '<td>' + getValid(part.price) + '</td>'+
                        '<td>' + getValid(part.descr) + '</td>'+
                    '</tr>';
            });
        }

        if (quote.labours) {
            quote.labours.forEach( (labour) => {
                labour_content += 
                    '<tr>' +
                        '<td>' + getValid(labour.hours) + '</td>'+
                        '<td>' + getValid(labour.price) + '</td>'+
                        '<td>' + getValid(labour.descr) + '</td>'+
                    '</tr>';
            });
        }

        let dir = path.dirname(require.main.filename);
        let html = fs.readFileSync(dir+'/public/template/invoice.html', 'utf8');
        html = html.replace('{{parts}}', part_content);
        html = html.replace('{{labours}}', labour_content);
        html = html.replace('{{parts_total}}', quote.parts_total);
        html = html.replace('{{vat}}', getValid(quote.vat));
        html = html.replace('{{labour_total}}', getValid(quote.labour_total));
        html = html.replace('{{invoiced_total}}', getValid(quote.invoiced_total));
        html = html.replace('{{au_parts_total}}', getValid(quote.au_parts_total));
        html = html.replace('{{claim_total}}', getValid(quote.claim_total));
        html = html.replace('{{vat_needed}}', quote.vat_needed? 'Yes':'No');
        html = html.replace('{{vehicle_reg}}', job.vehicle_reg);
        html = html.replace('{{customer_name}}', '');
        html = html.replace('{{type}}', title);
        html = html.replace('{{code}}', quote.code);

        html = html.replace('{{business1}}', getValid(dealer.business1));
        html = html.replace('{{business2}}', getValid(dealer.business2));
        html = html.replace('{{business3}}', getValid(dealer.business3));
        html = html.replace('{{business4}}', getValid(dealer.business4));
        html = html.replace('{{vat_no}}', getValid(user.vat_no));
        html = html.replace('{{company_no}}', getValid(user.company_no));

        html = html.replace('{{date}}', new Date(quote.created_at).toDateString());

        html = html.replace('{{vehicle_date}}', '');
        html = html.replace('{{customer_name}}', user.name);

        html = html.replace('{{vehicle_spec}}', '');
        html = html.replace('{{customer_spec}}', '');

        let options = {format: 'Letter'};
        
        let url = '/public/quotes/'+quote.code+'.pdf';
        pdf.create(html, options).toFile(dir+url, function(err, res) {
            if (err) return console.log(err);
        });

        return url;
    },

    correctDateFormat(dt:string) {
        let fnDate = function(ds) {
            let yy = 0;
            let m = 1;
            let dd = 0;

            if (ds.length == 3) {
                yy=Number(ds[0]);
                m=Number(ds[1]);
                dd=Number(ds[2]);
            }
            return {yy:yy, m:m-1, dd:dd};
        };

        let fnTime = function(ts) {
            let hh = 0;
            let mm = 0;
            let ss = 0;

            if (ts.length > 1) {
                hh=Number(ts[0]);
                mm=Number(ts[1]);
                if (ts.length > 2) ss=Number(ts[2]);
            }

            return {hh:hh, mm:mm, ss:ss};
        };

        if (!dt) return null;

        let dts = dt.split(" ");

        if (dts.length == 2) {
            let ds = dts[0].split(/-/);
            let ts = dts[1].split(":");

            let date = fnDate(ds);
            let time = fnTime(ts);

            return new Date(date.yy, date.m, date.dd, time.hh, time.mm, time.ss);
        }
        else if (dts.length == 1) {
            let ds = dts[0].split(/-/);
            let ts = dts[0].split(":");

            if (ds.length > 1) {
                let date = fnDate(ds);
                console.log("date ", date);
                return new Date(date.yy, date.m, date.dd);
            }
            else if (ts.length > 1) {
                let time = fnTime(ts);
                return new Date(0,0,0, time.hh, time.mm, time.ss);
            }
        }
        return null;
    }
  };
  
  export default xApi;
