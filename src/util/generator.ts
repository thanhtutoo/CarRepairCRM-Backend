import {v4 as genUuid} from 'uuid';
import * as shortid from 'shortid';

let generator = {
    uniqueNumber : () => {
        return Date.now() + Math.round(Math.random() * 10000);
    },

    uuid : () => {
        return genUuid();
    },

    // pin_code for Garage
    pinCode : () => {
        return shortid.generate();
    },

    // app_code for User
    postCode : () => {
        return shortid.generate();
    },

    unique7Digits: () => {
        //let s = "" + (Date.now() + Math.round(Math.random() * 9999999));
        let s = "" + ((Date.now().valueOf() + Math.round(Math.random() * 9999999)));
        return s.slice(s.length - 7, s.length);
    }

};

export default generator;
