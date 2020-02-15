import {Config, Decorator, Query, Table} from "dynamo-types"
import { WSAEDESTADDRREQ } from "constants";

export class JobState {
    static readonly JOB_STATE_SUBMITTED = "Submitted";
    static readonly JOB_STATE_QUOTE_PROVIDED = "Quote Provided";
    static readonly JOB_STATE_QUOTE_ACCEPTED = "Quote Accepted";
    static readonly JOB_STATE_PAID = "Paid";
    static readonly JOB_STATE_COMPLETED = "Completed";

    static readonly JOB_STATE_SUBMITTED_ID = 0;
    static readonly JOB_STATE_QUOTE_PROVIDED_ID = 1;
    static readonly JOB_STATE_QUOTE_ACCEPTED_ID = 2;
    static readonly JOB_STATE_PAID_ID = 3;
    static readonly JOB_STATE_COMPLETED_ID = 4;
    static readonly JOB_STATE_COUNT = 5;

    public state: string;
    public note: string;
    public date_at: string;

    static getStateId(state: string) {
        if (state == JobState.JOB_STATE_SUBMITTED) {
            return JobState.JOB_STATE_SUBMITTED_ID;
        }
        else if (state == JobState.JOB_STATE_QUOTE_PROVIDED) {
            return JobState.JOB_STATE_QUOTE_PROVIDED_ID;
        }
        else if (state == JobState.JOB_STATE_QUOTE_ACCEPTED) {
            return JobState.JOB_STATE_QUOTE_ACCEPTED_ID;
        }
        else if (state == JobState.JOB_STATE_PAID) {
            return JobState.JOB_STATE_PAID_ID;
        }
        else if (state == JobState.JOB_STATE_COMPLETED) {
            return JobState.JOB_STATE_COMPLETED_ID;
        }
        return 0;
    }
}

export class JobType {
    static readonly JOB_TYPE_SELF_SERVICE = "Self Service";
    static readonly JOB_TYPE_REPAIR = "Repair";
    static readonly JOB_TYPE_MOT = "Mot";
    static readonly JOB_TYPE_SERVICE = "Service";
    static readonly JOB_TYPE_CLAIM = "Claim";
}

@Decorator.Table({name: "Job"})
export class Job extends Table {

    @Decorator.Attribute()
    public id: number;

    @Decorator.Attribute()
    public app_code: string;        // garage app_code

    @Decorator.Attribute()
    public retailer: string;        // garage name

    @Decorator.Attribute()
    public vehicle_reg: string;

    @Decorator.Attribute()
    public vehicle_policy_no: number;

    @Decorator.Attribute()
    public cover: string;

    @Decorator.Attribute()
    public type: string;            // claim

    @Decorator.Attribute()
    public state: string;           // refer JobState

    @Decorator.Attribute()
    public state_id: number;       // refer JobState

    @Decorator.Attribute()
    public state_details: JobState[];

    @Decorator.Attribute()
    public descr: string;

    @Decorator.Attribute()
    public mileage: number;

    @Decorator.Attribute()
    public booked_at: string;

    @Decorator.Attribute()
    public created_at: string;

    @Decorator.Attribute()
    public updated_at: string;

    // Key && Index configuration
    @Decorator.HashPrimaryKey('id')
    public static readonly primary_key: Query.HashPrimaryKey<Job, number>;

    @Decorator.HashGlobalSecondaryIndex('vehicle_reg')
    public static readonly vehicle_reg_key: Query.HashGlobalSecondaryIndex<Job, string>;

    @Decorator.HashGlobalSecondaryIndex('app_code')
    public static readonly app_code_key: Query.HashGlobalSecondaryIndex<Job, string>;

    // Serializer
    @Decorator.Writer()
    public static readonly writer: Query.Writer<Job>;
}
