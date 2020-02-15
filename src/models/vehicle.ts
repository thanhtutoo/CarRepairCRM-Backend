import { Mot } from "./mot";

// import {Config, Decorator, Query, Table} from "dynamo-types"

// @Decorator.Table({name: "Vehicle"})
// export class Vehicle extends Table {
//     @Decorator.Attribute()
//     public reg_no: string;

//     @Decorator.Attribute()
//     public model: string;           // Safari, ...

//     @Decorator.Attribute()
//     public brand: string;           // Toyota, BMW, ...

//     //@Decorator.Attribute()
//     //public image: Image;            // Vehicle Image

//     @Decorator.Attribute()
//     public owner: number;           // Owner of this vehicle.

//     @Decorator.Attribute()
//     public last_policy_no: number;  // Last policy number.

//     @Decorator.Attribute()
//     public ved_band: string;        // tax

//     @Decorator.Attribute()
//     public co2: string;             // tax

//     @Decorator.Attribute()
//     public garage_pin_code: string;

//     @Decorator.Attribute()
//     public created_at: Date;

//     @Decorator.Attribute()
//     public updated_at: Date;

//     // Key && Index configuration
//     @Decorator.HashPrimaryKey('reg_no')
//     public static readonly primary_key: Query.HashPrimaryKey<Vehicle, string>;

//     // Serializer
//     @Decorator.Writer()
//     public static readonly writer: Query.Writer<Vehicle>;
// }

export class VehicleMeta {
    reg_no:             string;
    make:               string;
    taxed:              boolean;
    tax_due_at:         string;
    model:              string;
    previous_mot_at:    string;
    mot_due_at:         string;
    reminder_enable:    boolean;

    static fromVehicle(vehicle: any) {
        let meta = new VehicleMeta();
        meta.reg_no = vehicle.reg_no;
        meta.make = vehicle.make;
        meta.model = vehicle.model;
        meta.taxed = vehicle.taxed;
        meta.tax_due_at = vehicle.tax_due_at;

        meta.reminder_enable = true;

        if (vehicle.mots) {
            let mot_count = vehicle.mots.length;
            if (mot_count > 0) {
                meta.mot_due_at = vehicle.mots[0].mot_expiry_at;
            }
            if (mot_count < 1) {
                meta.previous_mot_at = meta.mot_due_at;
            }
            else if (mot_count > 1) {
                meta.previous_mot_at = vehicle.mots[mot_count - 2].expired_at;
            }
        }

        return meta;
    }
}

export class Vehicle {
    reg_no:             string;
    co2:                string;
    type_approval:      string;
    cylinder_capacity:  number;
    fuel:               string;
    registered_year:    string;
    registered_at:      string;
    make:               string;
    export_marker:      string;
    taxed:              boolean;
    tax_due_at:         string;
    is_sorn:            boolean;
    colour:             string;
    wheel_plan:         string;
    no_mot_data_held_by_dvla: boolean;
    no_mot_results_returned_by_dvla: boolean;
    raw_dvla_mot_status:    string;
    mot_exempt:         boolean;
    motd:               boolean;
    mot_expiry_at:      string;
    dvla_results:       boolean;
    dvsa_result:        boolean;
    dvla_dvsa_compatible: boolean;
    model:              string;
    mot_qty_recorded_in_miles:  number;
    mot_qty_recorded_in_kms:    number;
    mot_miles_and_kms:          boolean;
    mot_pass_qty:               number;
    mot_fail_qt:                number;
    mot_total_advisory_notices: number;
    mot_total_failure_notices:  number;
    make_dvsa:                  string;
    model_dvsa:                 string;
    first_used_dvsa_at:         string;
    mot_expiry_dvsa_at:         string;
    fuel_dvsa:                  string;
    colour_dvsa:                string;
    motd_dvsa:                  boolean;
    date_of_registration_source:    string;

    mots: Mot[];

    static fromJson = function(json_obj) {
        let vehicle = new Vehicle();
        let vehicle_json = json_obj["VehicleDetails"];
        
        vehicle.co2 = vehicle_json["CO2Emissions"];

        vehicle.type_approval = vehicle_json["VehicleTypeApproval"];
        vehicle.cylinder_capacity = vehicle_json["CylinderCapacity"];
        vehicle.fuel = vehicle_json["Fuel"];
        vehicle.registered_year = vehicle_json["Year"];
        vehicle.registered_at = vehicle_json["DateOfRegistration"];
        vehicle.make = vehicle_json["Make"];
        vehicle.export_marker = vehicle_json["ExportMarker"];

        vehicle.taxed = vehicle_json["Taxed"];
        vehicle.tax_due_at = vehicle_json["TaxDueDate"];
        vehicle.is_sorn = vehicle_json["IsSorn"];
        vehicle.colour = vehicle_json["Colour"];
        vehicle.wheel_plan = vehicle_json["Wheelplan"];
        vehicle.no_mot_data_held_by_dvla = vehicle_json["NoMotDataHeldByDvla"];
        vehicle.no_mot_results_returned_by_dvla = vehicle_json["NoMotResultsReturnedByDvla"];
        vehicle.raw_dvla_mot_status = vehicle_json["RawDvlaMotStatus"];
        vehicle.mot_exempt = vehicle_json["MotExempt"];
        vehicle.motd = vehicle_json["Motd"];
        vehicle.mot_expiry_at = vehicle_json["MotExpiryDate"];
        vehicle.dvla_results = vehicle_json["DvlaResults"];
        vehicle.dvsa_result = vehicle_json["DvsaResults"];
        vehicle.reg_no = vehicle_json["Registration"];
        vehicle.dvla_dvsa_compatible = vehicle_json["DvlaDvsaCompatible"];
        vehicle.model = vehicle_json["Model"];
        vehicle.mot_qty_recorded_in_miles = vehicle_json["MotQtyRecordedInMiles"];
        vehicle.mot_qty_recorded_in_kms = vehicle_json["MotQtyRecordedInKms"];
        vehicle.mot_miles_and_kms = vehicle_json["MotMilesAndKms"];
        vehicle.mot_pass_qty = vehicle_json["MotPassQty"];
        vehicle.mot_fail_qt = vehicle_json["MotFailQty"];
        vehicle.mot_total_advisory_notices = vehicle_json["MotTotalAdvisoryNotices"];
        vehicle.mot_total_failure_notices = vehicle_json["MotTotalFailureNotices"];
        vehicle.make_dvsa = vehicle_json["MakeDvsa"];
        vehicle.model_dvsa = vehicle_json["ModelDvsa"];
        vehicle.first_used_dvsa_at = vehicle_json["FirstUsedDateDvsa"];
        vehicle.mot_expiry_dvsa_at = vehicle_json["MotExpiryDateDvsa"];
        vehicle.fuel_dvsa = vehicle_json["FuelDvsa"];
        vehicle.colour_dvsa = vehicle_json["ColourDvsa"];
        vehicle.motd_dvsa = vehicle_json["MotdDvsa"];
        vehicle.date_of_registration_source = vehicle_json["DateOfRegistrationSource"];

        let mots_json = json_obj["VehicleMotData"];

        if (mots_json) {
            mots_json.forEach( mot_json => {
                let mot = Mot.fromJson(mot_json);
                if (vehicle.mots) {
                    vehicle.mots.push(mot);
                }
                else {
                    vehicle.mots = [mot];
                }
            });
        }

        return vehicle;
    }
}