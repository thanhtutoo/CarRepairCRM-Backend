import { Request, Response, NextFunction } from 'express';
import { User } from '../../models/user';
import xApi from '../../util/ext_api';
import { ResponseMessage } from '../constants';
import { Garage } from '../../models/garage';
import { Job, JobState, JobType } from '../../models/job';
import generator from '../../util/generator';
import { Claim } from '../../models/claim';
import { Service } from '../../models/service';
import { Repair } from '../../models/repair';
import { Notify } from '../../models/notify';
import logger from '../../util/logger';

export let controller = {
    getValid: function(v) {
        if (v && v != '') return v;
        return null;
    },

    createJob: function (type: string, descr: string, state: string, note: string, reg_no: string, booked_at: string) {
        let job = new Job();
        job.id = generator.uniqueNumber();
        job.type = type;
        job.descr = descr;
        job.state = state;
        job.state_id = 0;
        job.vehicle_reg = reg_no;
        job.booked_at = booked_at;

        if (type == JobType.JOB_TYPE_CLAIM) {
            let STATES = ["Enquiry",
            "Awaiting Diagnotics",
            "Diagnotics received processing",
            "Decline and accept",
            "Contribution offered",
            "Accepted",
            "Paid",
            "Submitted",
            "Quote provided",
            "Quote accepted",
            "Awaiting part",
            "Car being repaired",
            "Further issue found",
            "Invoice",
            "Invoice Paid",
            "Completed"];
            STATES.forEach ( (s) => {
                let job_state = new JobState();
                job_state.state = s;
                if (job.state_details) job.state_details.push(job_state);
                else job.state_details = [job_state];
            });
        }
        else {
            let STATES = [
            "Submitted",
            "Quote provided",
            "Quote accepted",
            "Awaiting part",
            "Car being repaired",
            "Further issue found",
            "Completed"];
            STATES.forEach ( (s) => {
                let job_state = new JobState();
                job_state.state = s;
                if (job.state_details) job.state_details.push(job_state);
                else job.state_details = [job_state];
            });
        }
        
        return job;
    },

    createNotification : function (from_app_code:string, to_app_code: string, to_email: string, subject:string, message: string) {
        let notify = new Notify();
        notify.id = generator.uniqueNumber();
        notify.from_app_code = from_app_code;
        notify.to_email = to_email;
        notify.to_app_code = to_app_code;
        notify.message = message;
        notify.created_at = new Date().toUTCString();
        notify.updated_at = new Date().toUTCString();
        
        return notify;
    },

    // get /api/services/
    all: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let services = await Service.primary_key.scan({limit: 100});
            res.json({status: ResponseMessage.OK, services: services.records});
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // get /api/services/self_service
    getSelfService: async (req: Request, res: Response, next: NextFunction) => {
        // req.body.reg_no

        res.json({status: ResponseMessage.NOT_IMPLEMENTED_YET, self_services: [
            {title: '1. Inspect your vehicle ', 
            content: 
'Performing the activities in your car maintenance checklist is quite easy. As we have already mentioned, the owner’s manual contains everything, including how you can perform a variety of basic car maintenance. More importantly, you will also know when you should perform these inspections. \
\
As much as possible, you have to perform the inspection yourself. This is just the simple process of assessing the different parts and components of your vehicle so that you will know what you need to do next. If the required action can be accomplished by you, then you’re performing basic car maintenance. If it requires some advanced tools or even extra pair of hands, then maybe bringing it to a professional will help.\
\
Performing an inspection is quite easy especially if you know what things you need to look for. Again, your owner’s manual can give you an idea of what to look for. This way, if something looks amiss, then you can take note of this and have a professional either confirm it or dismiss it as normal. Either way, the mere fact that you’ll be poking your nose around your car will greatly increase your knowledge of the different parts that make it such a wonderful machine.'},
            {title: '2. Learn the meaning of different warning light indicators', 
            content: 
'Modern cars have sophisticated sensors and warning systems that notify you that something is amiss. Even with meticulous inspections and maintenance, it is inadvertent that you’ll be able to cover all of them. That is why, as part of basic car maintenance, you need to learn the meaning of the different warning light indicators that flash on your instrument panel. Here are some of them.\
\
Check engine light – This typically indicates a problem in the various components of your car’s motor that has sensors connected to and actively monitored by an OBD-II interface. There are more than 4,000 OBD-II codes that have their respective meanings. If this indicator light comes on, you might want to use an OBD-II scanner tool or have a technician do it for you. \
Service engine light – This is an indicator light that will usually tell you you’re nearing a scheduled maintenance. It may come in various prints like “service”, “maint reqd”, or “service engine”. You can check your manual for the exact meaning of this indicator light. \
Electrical fault light – If this stays lit even after the car’s self-test, it simply means that your car’s electrical charging system has some issues that need to be assessed further. More often than not, an issue in the alternator will be at fault. \
Brake warning light – There are many reasons why this will suddenly flash on your instrument panel. It could be that your parking brakes are engaged or that your brake fluid levels need topping up. It can mean other things so your best bet is to check with your manual. \
ABS warning light – If this flashes, you’d better bring it to the nearest automotive shop for proper diagnosis. Anti-lock braking systems keep your car stable and controllable in sudden stop situations. Special tools are necessary to find out what’s wrong. \
Coolant warning light – You know what this means. Your engine is overheating. Pull over, open your hood, and just allow it to cool down. Do not ever attempt to open the radiator cap as the cooling system is actually highly pressurized. Do so when the engine has already cooled down. \
Oil warning light – This typically flashes if the oil pressure in your engine it too low. Don’t ever attempt to drive your vehicle with this warning light on as it can severely if not totally damage your engine. This warning light can be set off by low oil levels, oil pump failure, or even oil filter or oil strainer blockage \
\
car maintenance tips \
Wheels and Tires'},
            {title: '3. Check tire pressures', 
            content: 
'One of the things that impact fuel economy is tire pressure. It also affects comfort and handling. Your owner’s manual will have the recommended tire pressure for your vehicle. There are also gadgets and simple tools you can use to check the tire pressure. Ideally, this should be done on a weekly basis, although making it part of your daily routine won’t hurt. Some cars have tire pressure monitoring systems installed from the factory. There are also smart gadgets that connect with mobile devices that constantly monitor tire pressure and send out notifications in case one or more tires need some air.'},
            {title: '4. Check tread depth', 
            content: 
'In case you’re wondering why racers can put slick tires into their cars yet you cannot in your own car, the answer is quite simple. They have a pit crew that can literally put on a different kind of tire into the car whenever there is a change in weather and they do so in less than 10 seconds; you don’t. Race cars need optimum contact with the ground surface; that’s why their tires are unusually larger, wider, and come with very smooth, tread-less surface. However, in wet racetrack conditions, these super slick tires are replaced with more appropriate rubber to help channel the water on the racetrack away from the contact patch. If not, a multi-million dollar F1 car might as well be a multi-million dollar pile of wreck. \
\
In the real world, you need tires that can function in all weather conditions, be it dry, wet, or freezing cold. This is where tire treads come into play. If you look at your tires you’ll see tread patterns with wider contact patches to give you a more versatile rubber. Like we said, we don’t have the luxury of an F1 pit crew to replace our tires in a flash when the weather suddenly changes. \
\
The good news is that tire manufacturers today already integrate treat wear bars into their compounds to eliminate the hassle of guessing whether your tire treads are still deep enough to help channel water away from the tires and maintain excellent ground contact even in wet conditions. So if your tires don’t come with these tread wear indicators, you might as well get a new set. It may sound expensive but not as expensive as a vehicular accident. '},
            {title: '5. Rotate tires and have the alignment checked', 
            content: 
'Wheel balancing and alignment are important aspects of basic car maintenance since these can play a role in your car’s fuel economy, not to mention safety while on the road. It is thus crucial to have your tires rotated, balanced, and aligned according to the mileage that was indicated in your owner’s manual. The rule of thumb is to have it rotated every 5,000 miles although you can always double check with the manual for better accuracy. '},
            {title: '6. Clean the brake dust off your wheels', 
            content: 
'While brake dust doesn’t affect the full functioning of your brake system, they do make your wheels a little bit unpleasant to look at. One thing you need to understand is that brake dust is merely the accumulation of a variety of materials that come from the brake rotor and the brake pad itself as they come in contact when you apply the brakes. Iron accounts for about 92% of the dust. The remaining 8% will be carbon content, grime, dirt, and other particles that, if left to bake under the sun, will leave you with a severely stained wheel. As such, it is important to clean the dust off your wheels with a damp sponge. You will also need clean cold water because brake dust typically clings to your wheels via static electricity. \
Engine'},
            {title: '7. Check drive belts', 
            content: 
'Your engine does not only produce power to your wheels so your vehicle will run. It also generates power so that other parts and accessories run as well. This is the function of drive belts. They transfer power from your cam or crankshaft to the car’s alternator, air conditioning compressor, power steering pump, air pump, water pump, and any other device that relies on mechanical power. Modern cars use a single belt (also known as serpentine belt) to connect and rotate from the crank pulley. Unfortunately, because these belts are typically made of rubber or other polymers, they do wear a lot even with normal use. Over time, they lose their integrity and simply degrade. As such, it is important to check these belts from time to time to inspect for visible hairline cracks or any change in their integrity. You will need to look at the integrity of both your serpentine belt or V-belt and your timing belt (unless your engine is chain-driven). You also need to know the differences between the three. \
\
Most folks will tell you to replace your serpentine belt every 40,000 miles and your timing belt every 60,000 miles. We don’t actually have any numbers to recommend because we know only your car manufacturer has the solid backing to recommend what is the ideal mileage for replacing your drive belts. Still, we don’t recommend sticking to these guidelines blindly because these numbers are the results of tests on laboratory conditions, not in real world applications. Let these numbers, however, guide you so that if you’re already nearing the recommended mileage, then maybe it’s about time to have your drive belts be thoroughly inspected and evaluated. Of course, a better approach is to visually inspect them more frequently. This should help lower your average car maintenance costs by avoiding costly repairs. \
'},
            {title: '8. Check oil levels', 
            content: 
'Your car’s engine contains a lot of mechanical moving parts that create friction as they brush against each other. Friction generates heat and this can lead to a significant reduction in engine performance. That is why minimizing, if not eliminating, friction from these moving parts is critical to ensuring smoother operation; otherwise, you’d definitely be experience loud noises or knocking from your engine and even substantial reduction in fuel economy. Checking your engine’s oil level should thus be made an integral part of basic car maintenance. It’s quite easy, actually. Simply locate where the oil dipstick is, pull it out, and evaluate the oil. Well, not exactly.\
\
Always make sure that your car is parked on level ground. Remove the oil dipstick and wipe it first with a clean rag. This helps remove oil that may obscure the level indicators on the dipstick, making it quite difficult to read accurately. Once wiped clean, reinsert the dipstick all the way in and pull it out. Now, you should see exactly where the level of the oil is. The dipstick typically has indicators near the tip. There can be two notches or even dots marked by an H and an L. In some vehicles the area between these two points are also shaded or come with patterns to allow for easier assessment. Make sure that your oil level is within these two points.\
\
Also, it is critical to look at the color of the oil. It should not really be black. Engine oil is usually amber in color. Dark colored oil usually indicates the presence of contaminants, excessive heat, the addition of chemical additives or worst, sludge.\
\
As for the frequency of oil change, your owner’s manual can tell you exactly when you should change your engine oil. There are different types of oils, too, that can range from regular to semi-synthetic to fully synthetic. You will also need to check the correct viscosity grade for your car and for the environment upon which it normally operates on.\
'},
            {title: '9. Check engine coolant level', 
            content: 
'All moving things generate heat. And while there’s oil in your engine to help reduce the friction between moving parts and help prevent it from getting excessively hot at a much faster rate, your engine will also need a system that will help it get rid of this generated heat. That’s the function of your radiator and the fluid supplied to it is your engine coolant. If there’s no coolant in the reservoir or it is running low, then heat from the engine won’t get dissipated into the environment. This can lead to engine overheating. As part of your car maintenance checklist you need to check your engine coolant levels even before you start rolling out of your driveway. Checking it is quite easy since most cars today come with coolant reservoirs that are somehow translucent and with appropriate level markings on the panel. Even without you opening the lid of the reservoir, you should be able to visually inspect whether it is running low or not. The question now is where to look for the engine coolant reservoir in your car. The answer is simple – read your manual. '},
            {title: '10. Take note of fuel economy', 
            content: 
'Your engine’s performance is affected by a lot of things. And while there are several factors that may require some level of technical competence to evaluate, there is one thing you can try to assess yourself without so much as breaking a sweat – fuel economy. The idea is an efficiently running engine will burn fuel at a much steadier, more constant rate. If it works too hard, then it burns more fuel. If it burns more fuel, then you are going to feel it in your wallet. You’ll be finding yourself going to the petrol station to refuel a lot more often than you used to despite the fact that there is no change in your driving habits. This is often an indication of the engine working too hard that it is already burning more fuel than necessary. That is why it is important to be very mindful of your odometer and your trip readings. There are certain gadgets and apps, too that help you evaluate your current gas mileage. \
\
One of the more common reasons why you may have a sudden change in fuel economy is your tire pressure. If the tire is underinflated or is not aligned properly, your engine will have to increase its power output to propel your vehicle down the road. Adding extra weight on your car also affects fuel economy. Sudden acceleration and braking can also negatively impact your fuel economy.\
'},
        ]});

        /*
Inspect your vehicle 

Performing the activities in your car maintenance checklist is quite easy. As we have already mentioned, the owner’s manual contains everything, including how you can perform a variety of basic car maintenance. More importantly, you will also know when you should perform these inspections.

As much as possible, you have to perform the inspection yourself. This is just the simple process of assessing the different parts and components of your vehicle so that you will know what you need to do next. If the required action can be accomplished by you, then you’re performing basic car maintenance. If it requires some advanced tools or even extra pair of hands, then maybe bringing it to a professional will help.

Performing an inspection is quite easy especially if you know what things you need to look for. Again, your owner’s manual can give you an idea of what to look for. This way, if something looks amiss, then you can take note of this and have a professional either confirm it or dismiss it as normal. Either way, the mere fact that you’ll be poking your nose around your car will greatly increase your knowledge of the different parts that make it such a wonderful machine.
2. Learn the meaning of different warning light indicators 

Modern cars have sophisticated sensors and warning systems that notify you that something is amiss. Even with meticulous inspections and maintenance, it is inadvertent that you’ll be able to cover all of them. That is why, as part of basic car maintenance, you need to learn the meaning of the different warning light indicators that flash on your instrument panel. Here are some of them.

Check engine light – This typically indicates a problem in the various components of your car’s motor that has sensors connected to and actively monitored by an OBD-II interface. There are more than 4,000 OBD-II codes that have their respective meanings. If this indicator light comes on, you might want to use an OBD-II scanner tool or have a technician do it for you.
Service engine light – This is an indicator light that will usually tell you you’re nearing a scheduled maintenance. It may come in various prints like “service”, “maint reqd”, or “service engine”. You can check your manual for the exact meaning of this indicator light.
Electrical fault light – If this stays lit even after the car’s self-test, it simply means that your car’s electrical charging system has some issues that need to be assessed further. More often than not, an issue in the alternator will be at fault.
Brake warning light – There are many reasons why this will suddenly flash on your instrument panel. It could be that your parking brakes are engaged or that your brake fluid levels need topping up. It can mean other things so your best bet is to check with your manual.
ABS warning light – If this flashes, you’d better bring it to the nearest automotive shop for proper diagnosis. Anti-lock braking systems keep your car stable and controllable in sudden stop situations. Special tools are necessary to find out what’s wrong.
Coolant warning light – You know what this means. Your engine is overheating. Pull over, open your hood, and just allow it to cool down. Do not ever attempt to open the radiator cap as the cooling system is actually highly pressurized. Do so when the engine has already cooled down.
Oil warning light – This typically flashes if the oil pressure in your engine it too low. Don’t ever attempt to drive your vehicle with this warning light on as it can severely if not totally damage your engine. This warning light can be set off by low oil levels, oil pump failure, or even oil filter or oil strainer blockage

car maintenance tips
Wheels and Tires
3. Check tire pressures 

One of the things that impact fuel economy is tire pressure. It also affects comfort and handling. Your owner’s manual will have the recommended tire pressure for your vehicle. There are also gadgets and simple tools you can use to check the tire pressure. Ideally, this should be done on a weekly basis, although making it part of your daily routine won’t hurt. Some cars have tire pressure monitoring systems installed from the factory. There are also smart gadgets that connect with mobile devices that constantly monitor tire pressure and send out notifications in case one or more tires need some air.
4. Check tread depth 

In case you’re wondering why racers can put slick tires into their cars yet you cannot in your own car, the answer is quite simple. They have a pit crew that can literally put on a different kind of tire into the car whenever there is a change in weather and they do so in less than 10 seconds; you don’t. Race cars need optimum contact with the ground surface; that’s why their tires are unusually larger, wider, and come with very smooth, tread-less surface. However, in wet racetrack conditions, these super slick tires are replaced with more appropriate rubber to help channel the water on the racetrack away from the contact patch. If not, a multi-million dollar F1 car might as well be a multi-million dollar pile of wreck.

In the real world, you need tires that can function in all weather conditions, be it dry, wet, or freezing cold. This is where tire treads come into play. If you look at your tires you’ll see tread patterns with wider contact patches to give you a more versatile rubber. Like we said, we don’t have the luxury of an F1 pit crew to replace our tires in a flash when the weather suddenly changes.

The good news is that tire manufacturers today already integrate treat wear bars into their compounds to eliminate the hassle of guessing whether your tire treads are still deep enough to help channel water away from the tires and maintain excellent ground contact even in wet conditions. So if your tires don’t come with these tread wear indicators, you might as well get a new set. It may sound expensive but not as expensive as a vehicular accident. 
5. Rotate tires and have the alignment checked 

Wheel balancing and alignment are important aspects of basic car maintenance since these can play a role in your car’s fuel economy, not to mention safety while on the road. It is thus crucial to have your tires rotated, balanced, and aligned according to the mileage that was indicated in your owner’s manual. The rule of thumb is to have it rotated every 5,000 miles although you can always double check with the manual for better accuracy. 
6. Clean the brake dust off your wheels 

While brake dust doesn’t affect the full functioning of your brake system, they do make your wheels a little bit unpleasant to look at. One thing you need to understand is that brake dust is merely the accumulation of a variety of materials that come from the brake rotor and the brake pad itself as they come in contact when you apply the brakes. Iron accounts for about 92% of the dust. The remaining 8% will be carbon content, grime, dirt, and other particles that, if left to bake under the sun, will leave you with a severely stained wheel. As such, it is important to clean the dust off your wheels with a damp sponge. You will also need clean cold water because brake dust typically clings to your wheels via static electricity.
Engine
7. Check drive belts 

Your engine does not only produce power to your wheels so your vehicle will run. It also generates power so that other parts and accessories run as well. This is the function of drive belts. They transfer power from your cam or crankshaft to the car’s alternator, air conditioning compressor, power steering pump, air pump, water pump, and any other device that relies on mechanical power. Modern cars use a single belt (also known as serpentine belt) to connect and rotate from the crank pulley. Unfortunately, because these belts are typically made of rubber or other polymers, they do wear a lot even with normal use. Over time, they lose their integrity and simply degrade. As such, it is important to check these belts from time to time to inspect for visible hairline cracks or any change in their integrity. You will need to look at the integrity of both your serpentine belt or V-belt and your timing belt (unless your engine is chain-driven). You also need to know the differences between the three.

Most folks will tell you to replace your serpentine belt every 40,000 miles and your timing belt every 60,000 miles. We don’t actually have any numbers to recommend because we know only your car manufacturer has the solid backing to recommend what is the ideal mileage for replacing your drive belts. Still, we don’t recommend sticking to these guidelines blindly because these numbers are the results of tests on laboratory conditions, not in real world applications. Let these numbers, however, guide you so that if you’re already nearing the recommended mileage, then maybe it’s about time to have your drive belts be thoroughly inspected and evaluated. Of course, a better approach is to visually inspect them more frequently. This should help lower your average car maintenance costs by avoiding costly repairs. 
8. Check oil levels 

Your car’s engine contains a lot of mechanical moving parts that create friction as they brush against each other. Friction generates heat and this can lead to a significant reduction in engine performance. That is why minimizing, if not eliminating, friction from these moving parts is critical to ensuring smoother operation; otherwise, you’d definitely be experience loud noises or knocking from your engine and even substantial reduction in fuel economy. Checking your engine’s oil level should thus be made an integral part of basic car maintenance. It’s quite easy, actually. Simply locate where the oil dipstick is, pull it out, and evaluate the oil. Well, not exactly.

Always make sure that your car is parked on level ground. Remove the oil dipstick and wipe it first with a clean rag. This helps remove oil that may obscure the level indicators on the dipstick, making it quite difficult to read accurately. Once wiped clean, reinsert the dipstick all the way in and pull it out. Now, you should see exactly where the level of the oil is. The dipstick typically has indicators near the tip. There can be two notches or even dots marked by an H and an L. In some vehicles the area between these two points are also shaded or come with patterns to allow for easier assessment. Make sure that your oil level is within these two points.

Also, it is critical to look at the color of the oil. It should not really be black. Engine oil is usually amber in color. Dark colored oil usually indicates the presence of contaminants, excessive heat, the addition of chemical additives or worst, sludge.

As for the frequency of oil change, your owner’s manual can tell you exactly when you should change your engine oil. There are different types of oils, too, that can range from regular to semi-synthetic to fully synthetic. You will also need to check the correct viscosity grade for your car and for the environment upon which it normally operates on.
9. Check engine coolant level 

All moving things generate heat. And while there’s oil in your engine to help reduce the friction between moving parts and help prevent it from getting excessively hot at a much faster rate, your engine will also need a system that will help it get rid of this generated heat. That’s the function of your radiator and the fluid supplied to it is your engine coolant. If there’s no coolant in the reservoir or it is running low, then heat from the engine won’t get dissipated into the environment. This can lead to engine overheating. As part of your car maintenance checklist you need to check your engine coolant levels even before you start rolling out of your driveway. Checking it is quite easy since most cars today come with coolant reservoirs that are somehow translucent and with appropriate level markings on the panel. Even without you opening the lid of the reservoir, you should be able to visually inspect whether it is running low or not. The question now is where to look for the engine coolant reservoir in your car. The answer is simple – read your manual. 
10. Take note of fuel economy 

Your engine’s performance is affected by a lot of things. And while there are several factors that may require some level of technical competence to evaluate, there is one thing you can try to assess yourself without so much as breaking a sweat – fuel economy. The idea is an efficiently running engine will burn fuel at a much steadier, more constant rate. If it works too hard, then it burns more fuel. If it burns more fuel, then you are going to feel it in your wallet. You’ll be finding yourself going to the petrol station to refuel a lot more often than you used to despite the fact that there is no change in your driving habits. This is often an indication of the engine working too hard that it is already burning more fuel than necessary. That is why it is important to be very mindful of your odometer and your trip readings. There are certain gadgets and apps, too that help you evaluate your current gas mileage.

One of the more common reasons why you may have a sudden change in fuel economy is your tire pressure. If the tire is underinflated or is not aligned properly, your engine will have to increase its power output to propel your vehicle down the road. Adding extra weight on your car also affects fuel economy. Sudden acceleration and braking can also negatively impact your fuel economy.
        */
    },

    // post /api/services/repair
    reqRepair: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let repair = new Repair();
            repair.code = generator.postCode();
            repair.app_code = req.body.app_code;
            repair.vehicle_reg = req.body.reg_no;
            repair.booked_at = req.body.booked_at;
            repair.descr = controller.getValid(req.body.note);
            repair.type = JobType.JOB_TYPE_REPAIR;
            repair.created_at = new Date().toUTCString();
            repair.updated_at = new Date().toUTCString();

            let dealer = await User.primary_key.get(repair.app_code);
            let job = controller.createJob(
                repair.type, "Created Job by Repair.", "Submitted", repair.descr,
                repair.vehicle_reg, repair.booked_at);

            repair.job_id = job.id;
            job.retailer = dealer.name;
            job.app_code = repair.app_code;
            await job.save();

            await repair.save();
            await xApi.sendNotification(repair.vehicle_reg, repair.app_code, 
                xApi.getNotificationSubject("Repair requested", repair.code), 
                repair.descr
            );
            await xApi.updateSummary(repair.app_code, repair.booked_at, 'booked_repairs');

            res.json({status: ResponseMessage.OK});
        }
        catch (e) {
            logger.log(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // post /api/services/book_mot
    bookMot: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let repair = new Repair();
            repair.code = generator.postCode();
            repair.app_code = req.body.app_code;
            repair.vehicle_reg = req.body.reg_no;
            repair.booked_at = req.body.booked_at;
            repair.descr = controller.getValid(req.body.note);
            repair.type = JobType.JOB_TYPE_MOT;
            repair.created_at = new Date().toUTCString();
            repair.updated_at = new Date().toUTCString();

            let job = controller.createJob(
                repair.type, "Created Job by MOT.", "Submitted", repair.descr,
                repair.vehicle_reg, repair.booked_at);

            let dealer = await User.primary_key.get(repair.app_code);
            job.retailer = dealer.name;
            job.app_code = repair.app_code;
            await job.save();

            repair.job_id = job.id;

            await repair.save();

            await xApi.sendNotification(repair.vehicle_reg, repair.app_code, 
                xApi.getNotificationSubject("Booking Mot requested", repair.code), 
                repair.descr
            );

            await xApi.updateSummary(repair.app_code, repair.booked_at, 'booked_mots');

            res.json({status: ResponseMessage.OK});
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // post /api/services/book_service
    bookService: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let repair = new Repair();
            repair.code = generator.postCode();
            repair.app_code = req.body.app_code;
            repair.vehicle_reg = req.body.reg_no;
            repair.booked_at = req.body.booked_at;
            repair.descr = controller.getValid(req.body.note);
            repair.type = JobType.JOB_TYPE_SERVICE;
            repair.services = req.body.services;
            repair.created_at = new Date().toUTCString();
            repair.updated_at = new Date().toUTCString();

            let job = controller.createJob(
                repair.type, "Created Job by Service.", "Submitted", repair.descr,
                repair.vehicle_reg, repair.booked_at);

            repair.job_id = job.id;

            let dealer = await User.primary_key.get(repair.app_code);
            job.retailer = dealer.name;
            job.app_code = repair.app_code;
            
            await job.save();

            await repair.save();

            await xApi.sendNotification(repair.vehicle_reg, repair.app_code, 
                xApi.getNotificationSubject("Booking service requested", repair.code), 
                repair.descr
            );

            await xApi.updateSummary(repair.app_code, repair.booked_at, 'booked_services');

            res.json({status: ResponseMessage.OK});
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // post /api/services/claim
    reqClaim: async (req: Request, res: Response, next: NextFunction) => {
        // req.body.reg_no
        // req.body.email
        // req.body.app_code
        // req.body.description
        // req.body.mileage
        // req.body.vehicle_diagnosed_before
        // req.body.claim_registered_before

        try {
            // claim should go to AUADMIN01

            let claim = new Claim();
            claim.vehicle_reg = req.body.reg_no;
            claim.vehicle_diagnosed_before = req.body.vehicle_diagnosed_before;
            claim.claim_registered_before = req.body.claim_registered_before;
            claim.descr = controller.getValid(req.body.note || req.body.description);
            claim.app_code = 'AUADMIN01';//req.body.app_code;
            claim.code = generator.postCode();
            if (req.body.mileage) claim.mileage = req.body.mileage;

            claim.created_at = new Date().toUTCString();
            claim.updated_at = new Date().toUTCString();

            let job = controller.createJob(
                JobType.JOB_TYPE_CLAIM, "Created Job by Claim.", "Enquiry", claim.descr,
                claim.vehicle_reg, null);

            claim.job_id = job.id;
            let dealer = await User.primary_key.get(claim.app_code);
            job.retailer = dealer.name;
            job.app_code = claim.app_code;
            await job.save();

            await claim.save();

            await xApi.sendNotification(claim.vehicle_reg, claim.app_code, 
                xApi.getNotificationSubject("Booking service requested", claim.code), 
                claim.descr
            );

            res.json({status: ResponseMessage.OK});
        }
        catch (e) {
            logger.log(e);
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    
};
