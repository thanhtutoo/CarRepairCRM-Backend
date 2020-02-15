// import {Config, Decorator, Query, Table} from "dynamo-types"

// @Decorator.Table({name: "Mot"})
// export class Mot extends Table {

//     @Decorator.Attribute()
//     public id: number;

//     @Decorator.Attribute()
//     public vehicle_reg: string;

//     @Decorator.Attribute()
//     public started_at: Date;

//     @Decorator.Attribute()
//     public expired_at: Date;

//     @Decorator.Attribute()
//     public result: string;      // 'Pass' or 'Fail'

//     @Decorator.Attribute()
//     public odometer: number;

//     @Decorator.Attribute()
//     public odometer_unit: string;   // miles, km, m

//     @Decorator.Attribute()
//     public failed_reasons: string[];

//     @Decorator.Attribute()
//     public advisory: string[];

//     // Key && Index configuration
//     @Decorator.HashPrimaryKey('id')
//     public static readonly primary_key: Query.HashPrimaryKey<Mot, number>;

//     // Serializer
//     @Decorator.Writer()
//     public static readonly writer: Query.Writer<Mot>;
// }


export class Mot {
    mot_number:     number;

    test_at:        string;
    test_result:    boolean;

    odometer_unit:  string;
    odometer:       number;
    odometer_read:  string;
    
    expiry_at:      string;
    advisory_notice_items:  any[];
    reasons_for_failure:    any[];
    dangerous_count:    number;
    major_count:        number;
    minor_count:        number;

    static fromJson = function(json_obj) {
        let mot = new Mot();
        mot.mot_number = json_obj["MotNumber"];
        mot.test_result = json_obj["TestDate"];
        mot.odometer_unit = json_obj["OdometerUnit"];
        mot.odometer = json_obj["Odometer"];
        mot.expiry_at = json_obj["ExpiryDate"];
        mot.advisory_notice_items =json_obj["AdvisoryNoticeItems"];
        mot.reasons_for_failure = json_obj["ReasonsForFailure"];
        mot.dangerous_count = json_obj["DangerousCount"];
        mot.major_count = json_obj["MajorCount"];
        mot.minor_count = json_obj["MinorCount"];

        return mot;
    }
}
