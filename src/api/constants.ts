export class ResponseMessage {
    public static readonly OK = 'ok';
    public static readonly FAILED = 'failed';
    public static readonly AUTHORIZATION_FAILED = 'Authorization Failed.';
    public static readonly INVALID_PARAM_OR_INTERNAL_ERROR = 'Invalid Parameters or Internal Server Error.';
    public static readonly NOT_IMPLEMENTED_YET = "Not implemented yet.";
    public static readonly NOT_FOUND_GARAGE = "Not Found such garage.";
    public static readonly VEHICLE_ALREADY_EXISTS_IN_GARAGE = "This vehicle already exists in the garage.";
    public static readonly VEHICLE_DOESNOT_EXIST_IN_GARAGE = "This vehicle does not exist in the garage.";
    public static readonly DUPLICATED_USER = "There already exists a user has same post code or email.";
    public static readonly NOT_FOUND_JOB = 'Not found job';
    public static readonly NOT_FOUND_USER = 'Not found user';

    public static readonly INVALID_OPERATION = 'Invalid operation';
    public static readonly DUPLICATED_VEHICLE = 'Duplicated vehicle.';

    public static readonly FAILED_STRIPE_PAY = 'Failed to stripe pay.';
    
}

export class Contants {
    public static readonly RECORD_PER_PAGE = 10;
}
