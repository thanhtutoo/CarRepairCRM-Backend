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
var path = require('path');

var fileType = require('file-type');

export let controller = {

    // get /api/uploads/:filename
    getUpload: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let filename = req.params['filename'];
            let dir = path.dirname(require.main.filename);
            res.sendFile(dir + "/public/uploads/"+filename);
        }
        catch (e) {
            res.json({status: ResponseMessage.INVALID_PARAM_OR_INTERNAL_ERROR});
        }
    },
};
