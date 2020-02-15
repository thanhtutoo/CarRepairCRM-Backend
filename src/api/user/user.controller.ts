import { Request, Response, NextFunction } from 'express';
import { User } from '../../models/user';
import { Notify } from '../../models/notify';
import { ResponseMessage } from '../constants';
import generator from '../../util/generator';
import mailer from '../../util/mailer';
import xApi from '../../util/ext_api';
import { VehicleMeta, Vehicle } from '../../models/vehicle';
import logger from '../../util/logger';
import { Reminder } from '../../models/reminder';
import { Summary } from '../../models/summary';
import { Garage } from '../../models/garage';
import { Service } from '../../models/service';
import { DynamoDB } from 'aws-sdk';
import { Job } from '../../models/job';
import { VehicleUser } from '../../models/vehicle_user';
import { Quote } from '../../models/quote';
import { Order } from '../../models/order';

export let controller = {

    // get /api/users/
    all: async (req: Request, res: Response, next: NextFunction) => {
        // TODO:
        //  1. Check user role to determine permission.
        //  2. Get and return user list.

        try {
            let users = await User.primary_key.scan({limit: 100});
            let vehicle_users = await VehicleUser.primary_key.scan({limit: 100});
            res.json({status: ResponseMessage.OK, users: users.records, vehicle_users: vehicle_users});
        }
        catch(e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    generatePostCode: (req: Request, res: Response, next: NextFunction) => {
        res.json({status: ResponseMessage.OK, app_code: generator.unique7Digits()});
    },

    // post /api/users/register
    add: async (req: Request, res: Response, next: NextFunction) => {
        // TOOD:
        //  1. Register user.
        //  2. Email to user.

        try {
            let user = new User();
            user.created_at = new Date().toUTCString();
            user.updated_at = new Date().toUTCString();
            user.name = req.body.name;
            user.role = req.body.role;
            user.email = req.body.email;
            user.phone = req.body.phone;
            user.address1 = req.body.address1;
            user.address2 = req.body.address2;
            user.vat_no = req.body.vat_no;
            user.company_no = req.body.company_no;
            user.postal_code = req.body.postal_code;

            if (req.body.color != '') user.color = req.body.color;
            if (req.body.image_url != '') user.image_url = req.body.image_url;

            user.business1 = req.body.business1;
            user.business2 = req.body.business2;
            user.business3 = req.body.business3;
            user.business4 = req.body.business4;

            user.allow_mot = req.body.allow_mot;
            user.allow_service = req.body.allow_service;
            user.allow_repair = req.body.allow_repair;

            user.mobile_mechanic_available = req.body.mobile_mechanic_available;
            user.mobile_mechanic_range = req.body.mobile_mechanic_range;

            user.invoice_cost_for_admin = req.body.invoice_cost_for_admin;
            user.garage_cost_for_admin = req.body.garage_cost_for_admin;
            user.parent_app_code = req.body.parent_app_code;

            if (req.body.password) {
                user.password = req.body.password;
            }
            else if (req.body.password_group) {
                user.password = req.body.password_group.password;
            }
            user.app_code = req.body.app_code || generator.postCode();

            // check duplicated first.
            let same_code_user = await User.primary_key.get(user.app_code);
            let same_email_user = null;//await User.email_key.query(user.email);

            if (same_code_user || (same_email_user && same_email_user.count > 0)) {
                res.json({status: ResponseMessage.DUPLICATED_USER});
            }
            else {
                let geoloc = await xApi.getGeoLocation(user.postal_code);
                console.log("geoloc", geoloc);
                if (geoloc) {
                    user.lat = geoloc.lat;
                    user.lon = geoloc.lon;
                    user.address2 = geoloc.address;
                }

                await user.save();

                // mailer.send(
                //     user.email, 
                //     "Created a New User on AU", 
                //     "Create a New User. Post code is " + user.app_code, 
                //     "Create a New User. Post code is <bold>" + user.app_code + "</bold>");

                console.log('user is dealer', user.isDealer());
                if (user.isDealer()) {
                    let garage = new Garage();
                    garage.name = user.name;
                    garage.app_code = user.app_code;
                    garage.color = req.body.color;
                    garage.postal_code = user.postal_code;
                    garage.lat = user.lat;
                    garage.lon = user.lon;

                    console.log("GeoLocation ", geoloc);

                    if (req.body.image_url && req.body.image_url != "") {
                        garage.image_url = req.body.image_url;
                    }
                    garage.address = req.body.address1;

                    let services = await Service.primary_key.scan({limit: 100});
                    garage.services = services.records.map( (record) => {
                        return {id: record.id, name: record.name, price: record.price};
                    });
                    garage.vehicles = [];
                    garage.mobile_mechanic_available = req.body.mobile_mechanic_available;
                    garage.mobile_mechanic_range = req.body.mobile_mechanic_range;
                    garage.allow_mot = req.body.allow_mot;
                    garage.allow_repair = req.body.allow_repair;
                    garage.allow_service = req.body.allow_service;


                    garage.created_at = new Date().toUTCString();
                    garage.updated_at = new Date().toUTCString();

                    await garage.save();
                }

                res.json({status: ResponseMessage.OK, user: user});
            }
        }
        catch (e) {
            console.log(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },
    
    // get /api/users/:id
    get: async (req: Request, res: Response, next: NextFunction) => {
        // TODO:
        //  1. Check user role to determine permission.
        //  2. Get and return user has id.
        try {
            let user = await User.primary_key.get(req.params["app_code"]);
            res.json({status: ResponseMessage.OK, user: user});
        }
        catch(e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // put /api/users/:id
    update: async (req: Request, res: Response, next: NextFunction) => {
        // TODO:
        //  1. Check user role to determine permission.
        //  2. Update user.
        console.log("update user.");
        try {
            let user = await User.primary_key.get(req.params["app_code"]);

            user.name = req.body.name;
            user.role = req.body.role;
            user.email = req.body.email;
            user.phone = req.body.phone;
            user.address1 = req.body.address1;
            user.address2 = req.body.address2;
            user.vat_no = req.body.vat_no;
            user.company_no = req.body.company_no;
            user.postal_code = req.body.postal_code;
            
            if (req.body.color != '') user.color = req.body.color;
            if (req.body.image_url != '') user.image_url = req.body.image_url;

            user.business1 = req.body.business1;
            user.business2 = req.body.business2;
            user.business3 = req.body.business3;
            user.business4 = req.body.business4;

            user.allow_mot = req.body.allow_mot;
            user.allow_service = req.body.allow_service;
            user.allow_repair = req.body.allow_repair;

            user.mobile_mechanic_available = req.body.mobile_mechanic_available;
            user.mobile_mechanic_range = req.body.mobile_mechanic_range;

            user.last_used_at = req.body.last_used_at;
            user.invoice_cost_for_admin = req.body.invoice_cost_for_admin;
            user.garage_cost_for_admin = req.body.garage_cost_for_admin;

            if (req.body.password) {
                user.password = req.body.password;
            }
            else if (req.body.password_group) {
                user.password = req.body.password_group.password;
            }

            let geoloc = await xApi.getGeoLocation(user.postal_code);
            console.log("geoloc", user.postal_code, geoloc);
            if (geoloc) {
                user.lat = geoloc.lat;
                user.lon = geoloc.lon;
                user.address2 = geoloc.address;
            }

            user.updated_at = new Date().toUTCString();

            await user.save();

            if (user.isDealer()) {
                let garage = await Garage.primary_key.get(user.app_code);
                garage.color = user.color;
                garage.image_url = user.image_url;

                garage.postal_code = user.postal_code;
                garage.lat = user.lat;
                garage.lon = user.lon;

                if (req.body.image_url && req.body.image_url != "") {
                    garage.image_url = req.body.image_url;
                }
                garage.address = req.body.address1;

                garage.mobile_mechanic_available = req.body.mobile_mechanic_available;
                garage.mobile_mechanic_range = req.body.mobile_mechanic_range;
                garage.allow_mot = req.body.allow_mot;
                garage.allow_repair = req.body.allow_repair;
                garage.allow_service = req.body.allow_service;

                garage.updated_at = new Date().toUTCString();
                await garage.save();
            }

            res.json({status: ResponseMessage.OK, user: user});
        }
        catch (e) {
            console.log(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // delete /api/users/:id
    delete: async (req: Request, res: Response, next: NextFunction) => {
        // TODO:
        //  1. Check user role to determine permission.
        //  2. Delete user.
        try {
            let user = await User.primary_key.get(req.params["app_code"]);
            await user.delete();

            res.json({status: ResponseMessage.OK});
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // get /api/users/:app_code/notifications
    getNotifications: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let app_code = req.params["app_code"];

            console.log("notifications", app_code);
            let notifications = await Notify.to_app_code_key.query(app_code);

            res.json({status: ResponseMessage.OK, notifications: notifications.records});
        }
        catch (e) {
            console.log(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // post /api/users/:app_code/add_vehicle
    addVehicle: async (req: Request, res: Response, next: NextFunction) => {
        let app_code = req.params["app_code"];
        let reg_no = req.body.reg_no;
        
        try {
            let user = await User.primary_key.get(app_code);
            let user_code = await xApi.findUserCodeByVehicle(reg_no);
            if (!user_code) {
                let x_vehicle = await xApi.getVehicle(reg_no);
                let vehicle = Vehicle.fromJson(JSON.parse(x_vehicle));

                if (user && x_vehicle && vehicle) {
                    let vehicle_meta = VehicleMeta.fromVehicle(vehicle);

                    if (user.vehicles) {
                        user.vehicles.push(vehicle_meta);
                    }
                    else {
                        user.vehicles = [vehicle_meta];
                    }

                    await user.save();

                    let vehicle_user = new VehicleUser();
                    vehicle_user.app_code = app_code;
                    vehicle_user.reg_no = reg_no;
                    vehicle_user.created_at = new Date().toUTCString();
                    vehicle_user.updated_at = new Date().toUTCString();
                    await vehicle_user.save();

                    res.json({status: ResponseMessage.OK, vehicle: vehicle});
                }
                else {
                    res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
                }
            }
            else {
                res.json({status: ResponseMessage.DUPLICATED_VEHICLE});
            }
        }
        catch (e) {
            logger.error(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // post /api/users/:app_code/remove_vehicle
    removeVehicle: async (req: Request, res: Response, next: NextFunction) => {
        let app_code = req.params["app_code"];
        let reg_no = req.body.reg_no;

        try {
            let user = await User.primary_key.get(app_code);

            if (user) {
                for (let i = 0; i < user.vehicles.length; i++) {
                    if (user.vehicles[i].reg_no == reg_no) {

                        user.vehicles.splice(i, 1);
                        await user.save();

                        break;
                    }
                }

                let vehicle_user = await VehicleUser.primary_key.get(reg_no);
                if (vehicle_user) {
                    vehicle_user.delete();
                }

                res.json({status: ResponseMessage.OK});
            }
            else {
                res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
            }
        }
        catch (e) {
            res.json({status: ResponseMessage.NOT_IMPLEMENTED_YET});
        }
    },

    // get /api/users/:app_code/vehicles
    getVehicles: async (req: Request, res: Response, next: NextFunction) => {
        let app_code = req.params["app_code"];

        try {
            let user = await User.primary_key.get(app_code);

            if (user) {
                if (user.vehicles) {
                    res.json({status: ResponseMessage.OK, vehicles: user.vehicles});
                }
                else {
                    res.json({status: ResponseMessage.OK, vehicles: []});
                }
                
            }
            else {
                res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
            }
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // post /api/users/:app_code/add_reminder
    addReminder: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let app_code = req.params["app_code"];

            let reminder = new Reminder();
            reminder.id = generator.uniqueNumber();
            reminder.vehicle_reg = req.body.reg_no;
            reminder.name = req.body.name;
            reminder.enabled = req.body.enabled;
            reminder.descr = req.body.descr;

            if (req.body.month) {
                reminder.trigger_month = req.body.month;
                reminder.trigger_day = req.body.day;
                reminder.trigger_hour = req.body.hour;
                reminder.trigger_minute = req.body.minute;
                reminder.trigger_second = req.body.second;
            }
            else if (req.body.trigger_at) {
                reminder.trigger_at = req.body.trigger_at;
                
                let dts = req.body.trigger_at.split(' ');
                if (dts.length > 0) {
                    let dates = dts[0].split('/');
                    let times = dts[0].split(':');

                    if (dates.length > 0) {
                        if (dates.length == 2) {
                            reminder.trigger_month = dates[0];
                            reminder.trigger_day = dates[1];
                        }
                    }

                    if (times.length > 0) {
                        reminder.trigger_hour = times[0];

                        if (times.length > 1) {
                            reminder.trigger_minute = times[1];
                        }
                        else if (times.length > 2) {
                            reminder.trigger_second = times[2];
                        }
                    }
                }
            }
            
            reminder.created_at = new Date().toUTCString();
            reminder.updated_at = new Date().toUTCString();
            await reminder.save();

            res.json({status: ResponseMessage.OK, reminder: reminder});
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // post /api/users/:app_code/remove_reminder/:id
    removeReminder: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let app_code = req.params["app_code"];
            let reminder_id = req.params["id"]

            let reminder = await Reminder.primary_key.get(Number(reminder_id));
            await reminder.delete();

            res.json({status: ResponseMessage.OK});
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // post /api/users/:app_code/reminders
    getReminders: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let app_code = req.params["app_code"];
            let reg_no = req.body.reg_no;
            let reminders = await Reminder.vehicle_reg_key.query(reg_no);
            res.json({status: ResponseMessage.OK, reminders: reminders.records});
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },
    // get /api/users/:app_code/enable_reminders
    enableReminders: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let app_code = req.params["app_code"];
            let reg_no = req.body.reg_no;
            let enabled = req.body.enabled;
            let user = await User.primary_key.get(app_code);
            if (user) {
                let found = user.vehicles.find( (vehicle_meta) => {
                    if (vehicle_meta.reg_no == reg_no) {
                        return true;
                    }
                });

                if (found) {
                    found.reminder_enable = enabled;

                    await user.save();
                }
            }
            
            res.json({status: ResponseMessage.OK});
        }
        catch (e) {
            res.json({status: ResponseMessage.NOT_IMPLEMENTED_YET});
        }
    },

    // get /api/user/:app_code/summary
    getSummary : async(req: Request, res: Response, next: NextFunction) => {
        try {
            let now = new Date();
            let year_month = now.getFullYear() + "-" + now.getMonth();
            let app_code = req.params['app_code'];
            let user = await User.primary_key.get(app_code);

            if (user && user.isAdmin()) {
                let summary = await Summary.primary_key.query( {hash: 'AUADMIN01', range: [">=", year_month], rangeOrder: 'ASC', limit: 3} );
                res.json( {status: ResponseMessage.OK, summary: summary.records, cur_month: now.getMonth()} );
            }
            else {
                let summary = await Summary.primary_key.query( {hash: app_code, range: [">=", year_month], rangeOrder: 'ASC', limit: 3} );

                res.json( {status: ResponseMessage.OK, summary: summary.records, cur_month: now.getMonth()} );
            }
        }
        catch (e) {
            res.json( {status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR} );
        }
    },

    // get /api/user/:app_code/pricing
    getPricing : async(req: Request, res: Response, next: NextFunction) => {
        try {
            let user = await User.primary_key.get(req.params['app_code']);
            if (user.isDealer()) {
                let garage = await Garage.primary_key.get(user.app_code);
                res.json({status: ResponseMessage.OK, pricing: garage.services, admin: false});
            }
            else if (user.isAdmin()) {
                let services = await Service.primary_key.scan({limit: 100})
                res.json({status: ResponseMessage.OK, pricing: services.records, admin: true});
            }
            else {
                res.json({status: ResponseMessage.OK});
            }
        }
        catch (e) {
            res.json( {status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR} );
        }
    },

    updatePrice : async(req: Request, res: Response, next: NextFunction) => {
        try {
            let user = await User.primary_key.get(req.params['app_code']);
            if (user.isDealer()) {
                let garage = await Garage.primary_key.get(user.app_code);
                let price = req.body;

                let found = garage.services.find( (elm) => {
                    return elm.name == price.name;
                });

                if (found) {
                    found.price = price.price;
                    found.updated_at = new Date().toUTCString();
                    await garage.save();
                }
                else {
                    if (garage.services) {
                        garage.services.push(price);
                    }
                    else {
                        garage.services = [price];
                    }
                    await garage.save();
                }

                res.json( {status: ResponseMessage.OK, price: price} );
            }
            else if (user.isAdmin()){
                res.json( {status: ResponseMessage.INVALID_OPERATION} );
            }
        }
        catch (e) {
            res.json( {status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR} );
        }
    },
    findUsers : async(req: Request, res: Response, next: NextFunction) => {
        try {
            let app_code = req.params['app_code'];
            let user = await User.primary_key.get(app_code);
            let filter_dealer = req.body.dealer_filter ? true : false; // {vehicle_reg, app_code, name}

            if (user.isDealer() || user.isAdmin()) {
                let is_eof = false;
                let users: any;
                let filtered = [];

                while (!is_eof) {
                    if (user.isDealer()) {
                        users = await User.parent_app_code_key.query(user.app_code);
                    }
                    else {
                        users = await User.primary_key.scan( {limit: 100 });
                    }

                    users.records.forEach(element => {
                        if (element.isDealer()) {
                            if (filter_dealer) filtered.push(element);
                        }
                        else if (element.isUser()) {
                            if (!filter_dealer) filtered.push(element);
                        }
                    });
                    
                    if (!users.lastEvaluatedKey) {
                        is_eof = true;
                    }
                }

                res.json( {status: ResponseMessage.OK, users: filtered} );
            }
            else {
                res.json( {status: ResponseMessage.INVALID_OPERATION} );
            }
        }
        catch (e) {
            logger.error(e);
            res.json( {status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR} );
        }
    },

    findUser : async(req: Request, res: Response, next: NextFunction) => {
        let findUserInRecords = function(users, search) {
            
            let found = users.find( (elm) => {
                if (elm.vehicles && search.vehicle_reg && search.vehicle_reg != '') {
                    let vehicle_regs = elm.vehicles.map( (d) => {
                        return d.reg_no;
                    });

                    return vehicle_regs.indexOf(search.vehicle_reg) != -1;
                }

                if (search.name && search.name != '' && elm.name == search.nam) {
                    return true;
                }
                return false;
            });

            console.log(users.length);
            
            return found;
        }

        try {
            let app_code = req.params['app_code'];
            let user = await User.primary_key.get(app_code);
            let search = req.body; // {vehicle_reg, app_code, name}

            if (user.isDealer() || user.isAdmin()) {
                let found = null;

                if (search.app_code && search.app_code != '') {
                    let found1 = await User.primary_key.get(search.app_code);
                    if (user.isAdmin()) {
                        found = found1;
                    }
                    else if (found1.parent_app_code == app_code) {
                        found = found1;
                    }
                }

                if (!found && 
                    (search.vehicle_reg && search.vehicle_reg != '' || 
                    search.name && search.name != '')) {
                    let users: any;

                    let is_eof = false;
                    while (!found && !is_eof) {
                        if (user.isDealer()) {
                            users = await User.parent_app_code_key.query(user.app_code);
                        }
                        else {
                            users = await User.primary_key.scan( {limit: 100 });
                        }

                        found = findUserInRecords(users.records, search);
                        
                        if (!users.lastEvaluatedKey) {
                            is_eof = true;
                        }
                    }
                }

                res.json( {status: ResponseMessage.OK, user: found} );
            }
            else {
                res.json( {status: ResponseMessage.INVALID_OPERATION} );
            }
        }
        catch (e) {
            res.json( {status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR} );
        }
    },

    sendNotification : async(req: Request, res: Response, next: NextFunction) => {
        try {
            let notify = new Notify();
            notify.id = generator.uniqueNumber();
            notify.message = req.body.message;
            notify.from_app_code = req.params['app_code'];
            notify.to_app_code = req.body.to_app_code;
            notify.to_email = req.body.to_email;
            notify.subject = "Notification From " + notify.from_app_code;
            notify.created_at = new Date().toUTCString();
            notify.updated_at = new Date().toUTCString();

            console.log("add notify", notify);
            //notify.attachment;
            //notify.attachment_type;
            //notify.attachment_size;
            //notify.attachment_name;

            await notify.save();

            res.json( {status: ResponseMessage.OK} );
        }
        catch (e) {
            res.json( {status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR} );
        }

    },

    findJobs : async(req: Request, res: Response, next: NextFunction) => {
        try {
            let app_code = req.params['app_code'];
            let search = {
                date: xApi.correctDateFormat(req.body.date),
                vehicle_reg: req.body.vehicle_reg,
                state: req.body.state
            }

            let user = await User.primary_key.get(app_code);

            console.log('find jobs', search);
            let findRecords = function(records, search, start_key) {
                if (search && (search.date || search.state || search.vehicle_reg)) {
                    let sub_filtered = records.filter( (record) => {
                        let ret = true;
                        if (search.date) {
                            let dt1 = new Date(record.booked_at||record.created_at);
                            if (dt1.getFullYear() == search.date.getFullYear() &&
                                dt1.getMonth() == search.date.getMonth() &&
                                dt1.getDate() == search.date.getDate()) {
                                // nothing to do.
                            }
                            else {
                                ret = false;
                            }
                        }

                        if (ret && search.state && search.state != '') {
                            ret = ret && record.state == search.state;
                        }

                        if (ret && search.vehicle_reg && search.vehicle_reg != '') {
                            ret = ret && record.vehicle_reg.startsWith(search.vehicle_reg);
                        }
                        
                        return ret;
                    });

                    return sub_filtered;
                }
                return records;
            }

            if (user.isDealer()) {
                let filtered = [];

                let jobs = await Job.app_code_key.query( app_code );
                
                filtered = jobs.records;//findRecords(jobs.records, search, null);
                console.log(filtered, app_code);

                res.json( {status: ResponseMessage.INVALID_OPERATION, jobs: filtered} );
            }
            else if (user.isAdmin()) {
                let is_eof = false;
                let start_key: any;
                let filtered = [];

                while (!is_eof) {
                    let jobs = await Job.primary_key.scan({limit: 100, exclusiveStartKey: start_key});
                    filtered = jobs.records ;//findRecords(jobs.records, search, start_key);
                    start_key = jobs.lastEvaluatedKey;
                    is_eof = filtered.length > 30 || !start_key;
                }

                res.json( {status: ResponseMessage.INVALID_OPERATION, jobs: filtered} );
            }
            else {
                res.json( {status: ResponseMessage.INVALID_OPERATION} );
            }
        }
        catch (e) {
            logger.error(e);
            res.json( {status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR} );
        }
    },

    findUserByVehicle : async(req: Request, res: Response, next: NextFunction) => {
        try {
            let vehicle_reg = req.body.reg_no;
            let vehicle_user = await VehicleUser.primary_key.get(vehicle_reg);

            if (vehicle_user) {
                let user = await User.primary_key.get(vehicle_user.app_code);

                res.json( {status: ResponseMessage.OK, user: user} );
            }
            else {
                res.json( {status: ResponseMessage.INVALID_OPERATION} );
            }
        }
        catch (e) {
            res.json( {status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR} );
        }
    },

    getQuotes : async(req: Request, res: Response, next: NextFunction) => {
        try {
            let app_code = req.params['app_code'];
            let search = {
                date: req.body.date,
                vehicle_reg: req.body.vehicle_reg,
            };

            let quotes = await Quote.app_code_key.query(app_code, {limit: 100});

            res.json( {status: ResponseMessage.OK, quotes: quotes.records});
        }
        catch (e) {
            res.json( {status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR} );
        }
    },

    getOrders : async(req: Request, res: Response, next: NextFunction) => {
        try {
            let app_code = req.params['app_code'];
            let orders = await Order.app_code_key.query(app_code, {limit: 100});

            res.json( {status: ResponseMessage.OK, orders: orders.records});
        }
        catch (e) {
            res.json( {status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR} );
        }
    }

};
