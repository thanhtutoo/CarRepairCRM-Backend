import { Request, Response, NextFunction } from 'express';
import { Garage } from '../../models/garage';
import xApi from '../../util/ext_api';
import { ResponseMessage, Contants } from '../constants';
import generator from '../../util/generator';
import { VehicleMeta } from '../../models/vehicle';
import { S3 } from 'aws-sdk';
import logger from '../../util/logger';
import * as multiparty from 'multiparty';
import * as fs from 'fs';
import * as multer from 'multer';
var fileType = require('file-type');

export let controller = {

    // get /api/garages/
    all: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let garages = await Garage.primary_key.scan({limit: Contants.RECORD_PER_PAGE});
            res.json({status: ResponseMessage.OK, garages: garages.records});
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // post /api/garages/add
    add: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let garage = new Garage();
            garage.name = req.body.name;
            garage.address = req.body.address;
            garage.lat = req.body.lat;
            garage.lon = req.body.lon;
            garage.image_url = req.body.image_url;
            garage.color = req.body.color;
            garage.app_code = req.body.app_code || generator.postCode();
            garage.created_at = new Date().toUTCString();
            garage.updated_at = new Date().toUTCString();

            await garage.save();

            res.json({status: ResponseMessage.OK, garage: garage});
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },
    
    // get /api/garages/:app_code
    get: async (req: Request, res: Response, next: NextFunction) => {
        let app_code = req.params['app_code'];
        let garage = await Garage.primary_key.get(app_code);

        res.json({status: ResponseMessage.OK, garage: garage});
    },

    // put /api/garages/:app_code
    update: async(req: Request, res: Response, next: NextFunction) => {
        let app_code = req.params['app_code'];
        try {
            let garage = await Garage.primary_key.get(app_code);

            if (garage) {
                garage.updated_at = new Date().toUTCString();
                garage.name = req.body.name;
                garage.address = req.body.address;
                garage.lat = req.body.lat;
                garage.lon = req.body.lon;
                garage.image_url = req.body.image_url;
                garage.color = req.body.color;

                await garage.save();
                res.json({status: ResponseMessage.OK});
            }
            else {
                res.json({status: ResponseMessage.NOT_FOUND_GARAGE});
            }
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // delete /api/garages/:app_code
    delete: async (req: Request, res: Response, next: NextFunction) => {
        let app_code = req.params['app_code'];
        try {
            let garage = await Garage.primary_key.get(app_code);

            if (garage) {
                await garage.delete();

                res.json({status: ResponseMessage.OK});
            }
            else {
                res.json({status: ResponseMessage.NOT_FOUND_GARAGE});
            }
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // get /api/garages/:app_code/vehicles
    getVehicles: async (req: Request, res: Response, next: NextFunction) => {
        // let vehicles = xApi.getVehicles(req.params['app_code']);
        try
        {
            let app_code = req.params['app_code'];
            let garage = await Garage.primary_key.get(app_code);
            if (garage) {
                res.json( {status: ResponseMessage.OK, vehicles: garage.vehicles});
            }
            else {
                res.json( {status: ResponseMessage.OK, vehicles: []});
            }
        }
        catch (e) {
            res.json( {status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // get /api/garages/:app_code/vehicles
    getUsers: async (req: Request, res: Response, next: NextFunction) => {
        res.json( {status: ResponseMessage.NOT_IMPLEMENTED_YET });
    },

    // post /api/garages/find_by_service
    findByService: async (req: Request, res: Response, next: NextFunction) => {
        // req.body.app_code
        // req.body.service
        try {
            let garages = await Garage.primary_key.scan( {limit: 100} );
            let found_garages = garages.records;

            res.json( {status: ResponseMessage.OK, garages: found_garages});
        }
        catch (e) {
            res.json( {status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR });
        }
    },

    // post /api/garage/:app_code/set_services
    setServices: async (req: Request, res: Response, next: NextFunction) => {
        // req.body.app_code || req.params["app_code"]
        // req.body.services

        try {
            let garage = await Garage.primary_key.get(req.body.app_code);

            if (garage) {
                garage.services = req.body.services;
                await garage.save();

                res.json({status: ResponseMessage.OK});
            }
            else {
                res.json({status: ResponseMessage.NOT_FOUND_GARAGE});
            }
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // post /api/garage/:app_code/add_vehicle
    addVehicle: async (req: Request, res: Response, next: NextFunction) => {
        // req.body.app_code || req.params["app_code"]
        // req.body.reg_no

        try {
            let reg_no = req.body.reg_no;
            let app_code = req.body.app_code || req.params["app_code"];

            let garage = await Garage.primary_key.get(app_code);

            if (garage) {
                let vehicle_meta = garage.vehicles.find(vehicle_meta => {
                    return vehicle_meta.reg_no == reg_no;
                });

                if (vehicle_meta) {
                    res.json({status: ResponseMessage.VEHICLE_ALREADY_EXISTS_IN_GARAGE});
                }
                else {
                    vehicle_meta = new VehicleMeta();
                    vehicle_meta.reg_no = reg_no;
                    
                    garage.vehicles.push(vehicle_meta);

                    await garage.save();

                    res.json({status: ResponseMessage.OK});
                }
            }
            else {
                res.json({status: ResponseMessage.NOT_FOUND_GARAGE});
            }
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    // post /api/garage/:app_code/remove_vehicle
    removeVehicle: async (req: Request, res: Response, next: NextFunction) => {
        // req.body.app_code || req.params["app_code"]
        // req.body.reg_no

        try {
            let reg_no = req.body.reg_no;
            let app_code = req.body.app_code || req.params["app_code"];

            let garage = await Garage.primary_key.get(app_code);

            if (garage) {
                let vehicle_meta = garage.vehicles.find(vehicle_meta => {
                    return vehicle_meta.reg_no == reg_no;
                });

                if (vehicle_meta) {
                    let i = garage.vehicles.indexOf(vehicle_meta);
                    garage.vehicles.splice(i, 1);

                    await garage.save();

                    res.json({status: ResponseMessage.OK});
                }
                else {
                    res.json({status: ResponseMessage.VEHICLE_DOESNOT_EXIST_IN_GARAGE});
                }
                
            }
            else {
                res.json({status: ResponseMessage.NOT_FOUND_GARAGE});
            }
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },

    uploadPhoto :  async (req: Request, res: Response, next: NextFunction) => {
        let file = req['file'];

        if (file) {
            res.json({status: ResponseMessage.OK, url: '/public/uploads/' + file.filename});
        }
        else {
            res.json({status: ResponseMessage.FAILED});
        }

       
        // try {
            
            
        //     const buffer = file.buffer;
        //     var ab = new Uint8Array(buffer, buffer.byteOffset, buffer.byteLength);
        //     const type = fileType(ab);
        //     const timestamp = Date.now().toString();
        //     const filename = 'garages/'+timestamp+"."+type;

        //     console.log(filename, buffer);
        //     let s3 = new S3();
        //     let params = {
        //         Bucket: 'au-aws-s3-app-bucket', 
        //         Key: filename, 
        //         Body: ab
        //     };
        //     let data = await s3.upload(params);
        //     console.log(data);
        //     res.json({status: ResponseMessage.OK, id: data});
        // }
        // catch (e) {
        //     logger.error(e);
        //     res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        // }
    }
};
