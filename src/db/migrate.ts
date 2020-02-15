import { User, UserRole } from '../models/user';
import { Claim } from '../models/claim';
import { Job } from '../models/job';
import { Notify } from '../models/notify';
import { Reminder } from '../models/reminder';
import { Garage } from '../models/garage';
import  logger from '../util/logger';
import generator from '../util/generator';
import { Labour } from '../models/labour';
import { VehiclePart } from '../models/vehicle_part';
import { Quote } from '../models/quote';
import { VehicleMeta, Vehicle } from '../models/vehicle';
import xApi from '../util/ext_api';
import { Service } from '../models/service';
import { VehicleUser } from '../models/vehicle_user';
import { Summary } from '../models/summary';
import { Order } from '../models/order';
import { notifyRouter } from '../api/notify/notify.router';
import { Warranty } from '../models/warranty';
import { Policy } from '../models/policy';
import { Repair } from '../models/repair';

export const createDatabase = async () => {
    try {
        await fixDb();

        // logger.log("create User table");
        // await User.createTable();
        // logger.log("create Claim table");
        // await Claim.createTable();
        // logger.log("create Job table");
        // await Job.createTable();
        // logger.log("create Notify table");
        // await Notify.createTable();
        // logger.log("create Reminder table");
        // await Reminder.createTable();
        // logger.log("create Garage table");
        // await Garage.createTable();

        // logger.log("create Quote table");
        // await Quote.createTable();

        // logger.log("create Service table");
        // await Service.createTable();

        // logger.log("create Vehicle User table");
        // await VehicleUser.createTable();
        // logger.log("create Summary table");
        // await Summary.createTable();

        // logger.log("create Order table");
        // await Order.createTable();

        // logger.log("create Warranty table");
        // await Warranty.createTable();
        // logger.log("create Policy table");
        // await Policy.createTable();

        // logger.log("create Repair table");
        // await Repair.createTable();

        // await makeSeed();
        logger.log("===Created Database===")
    }
    catch (e) {
        logger.error("===Failed to Create Database===", e);
    }
}

export const destroyDatabase = async () => {
    try {
        // logger.log("drop User table");
        // await User.dropTable();
        logger.log("drop Claim table");
        await Claim.dropTable();
        logger.log("drop Job table");
        await Job.dropTable();
        logger.log("drop Notify table");
        await Notify.dropTable();
        logger.log("drop Reminder table");
        await Reminder.dropTable();
        logger.log("drop Garage table");
        await Garage.dropTable();
        logger.log("drop Quote table");
        await Quote.dropTable();
        logger.log("drop Service table");
        await Service.dropTable();

        logger.log("drop Vehicle User table");
        await VehicleUser.dropTable();
        logger.log("drop Summary table");
        await Summary.dropTable();

        logger.log("drop Order table");
        await Order.dropTable();

        logger.log("drop Warranty table");
        await Warranty.dropTable();
        logger.log("drop Policy table");
        await Policy.dropTable();

        logger.log("drop Repair table");
        await Repair.dropTable();


        logger.log("===Destroyed Database===")
    }
    catch (e) {
        logger.error("===Failed to Destroy Database===");
    }
}

export const makeSeed = async () => {
    try {
        let user = await User.primary_key.get('2073128');
        user.parent_app_code = '1545644';
        await user.save();


        // logger.log("Add Admin User");
        // let admin = new User();
        // admin.app_code = 'AUADMIN01';
        // admin.name = "AU";
        // admin.password = "a";
        // admin.email = "au.warranty@outlook.com";
        // admin.role = UserRole.USER_ADMIN;
        // admin.created_at = new Date().toUTCString();
        // admin.updated_at = new Date().toUTCString();
        // await admin.save();

        // let quotes = await Quote.primary_key.scan({limit:10});
        // console.log(quotes.count);
        // for (let i = 0; i < quotes.count; i++) {
        //     let quote = quotes.records[i];
        //     quote.app_code = 'm-YMzf9uU';
        //     await quote.save();
        // }

        // let jobs = await Quote.primary_key.scan({limit:10});
        // console.log(jobs.count);
        // for (let i = 0; i < jobs.count; i++) {

        // }
        // jobs.records.forEach ( async (job) => {
        //     job.app_code = 'm-YMzf9uU';
        //     await job.save();
        // });

        // let notify = await Notify.primary_key.get(1545382695399);
        // notify.message = "Job Quote. Look at Attachment quotation pdf. And please Accept it.";
        // notify.quote_code = "xnnJP0u61";
        // notify.attachment = "public/quotes/xnnJP0u61.pdf";
        // notify.type = "quote";
        // await notify.save();

        // logger.log("Preparing service init data.");
        // // service
        // let services = ["MOT", "Short Service", "Master Service", "Tyres", 
        //                 "Brakes", "Exhausts", "Cambelt", "Cam chain", "Clutches", "Air con", "Other"];
        // services.forEach( async (service_name) => {
        //     let service = new Service();
        //     service.name = service_name;
        //     service.id = generator.uniqueNumber();
        //     service.price = 10;
        //     service.created_at = new Date().toUTCString();
        //     service.updated_at = new Date().toUTCString();

        //     await service.save();
        // });

        // logger.log("Add Admin User");
        // let admin = new User();
        // admin.app_code = 'AUADMIN01';
        // admin.name = "jinfeng";
        // admin.password = "a";
        // admin.email = "jinfengliu106@gmail.com";
        // admin.role = UserRole.USER_ADMIN;
        // admin.created_at = new Date().toUTCString();
        // admin.updated_at = new Date().toUTCString();
        // await admin.save();

        // logger.log("Add Dealer");
        // let dealer = new User();
        // dealer.app_code = generator.postCode();
        // dealer.name = "dealer101";
        // dealer.password = "a";
        // dealer.email = "dealer101@gmail.com";
        // dealer.role = UserRole.USER_DEALER;
        // dealer.created_at = new Date().toUTCString();
        // dealer.updated_at = new Date().toUTCString();
        // await dealer.save();

        // logger.log("Add User");
        // let user = new User();
        // user.app_code = generator.postCode();
        // user.name = "user101";
        // user.password = "a";
        // user.email = "user101@gmail.com";
        // user.role = UserRole.USER_CUSTOMER;
        // user.created_at = new Date().toUTCString();
        // user.updated_at = new Date().toUTCString();

        // logger.log("Add Garage");
        // let garage = new Garage();
        // garage.app_code = dealer.app_code;
        // garage.name = "HOTSPOT Garage";
        // garage.address = "London street No.1";
        // garage.lat = 52.1;
        // garage.lon = 0.2;
        // garage.vehicles = [];
        // garage.color = '#008000';
        // garage.image_url = '/public/uploads/1544786106083.png';
        // await garage.save();


        // services.forEach( async (service_name) => {
        //     let service = {
        //         id: generator.uniqueNumber,
        //         name: service_name, 
        //         price: 10,
        //         created_at: new Date().toUTCString(),
        //         updated_at:new Date().toUTCString()
        //     };
        //     if (garage.services) {
        //         garage.services.push(service);
        //     }
        //     else {
        //         garage.services = [service];
        //     }
        // });

        // await garage.save();

        // // add reminder
        // {
        //     let reminder = new Reminder();
        //     reminder.id = generator.uniqueNumber();
        //     reminder.vehicle_reg = "BJ55FWR";
        //     reminder.name = "Reminder Test";
        //     reminder.enabled = true;
        //     reminder.trigger_month = 10;
        //     reminder.trigger_day = 10;
        //     reminder.trigger_hour = 10;
        //     reminder.trigger_minute = 10;
        //     reminder.trigger_second = 10;
        //     await reminder.save();
        // }

        // console.log(admin.app_code, dealer.app_code, user.app_code);
    }
    catch (e) {
        logger.error("===Failed to Make seed data===");
    }
}


export const fixDb = async () => {
    try {

        logger.log("===Repair job===");
        let repairs = await Repair.primary_key.scan({limit:100});
        for (let i = 0; i < repairs.count; i++) {
            let job = await Job.primary_key.get(repairs.records[i].job_id);
            job.app_code = repairs.records[i].app_code;
            await job.save();
        }

        logger.log("===Claim job===");
        let claims = await Claim.primary_key.scan({limit:100});
        for (let i = 0; i <claims.count; i++) {
            let job = await Job.primary_key.get(claims.records[i].job_id);
            if (job) {
                job.app_code = 'AUADMIN01';
                await job.save();
            }
            claims.records[i].app_code = 'AUADMIN01';
            await claims.records[i].save();
        }
    }
    catch (e) {
        logger.error("===Failed to fix seed data===");
    }
}
