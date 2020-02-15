import { Config, Decorator, Query, Table } from "dynamo-types"
import { VehicleMeta } from "./vehicle";
import { doesNotThrow } from "assert";

export class UserRole {
    public static USER_ADMIN = "Admin";
    public static USER_DEALER = "Dealer";
    public static USER_CUSTOMER = "Customer";
}

@Decorator.Table({ name: "User" })
export class User extends Table {

    @Decorator.Attribute()
    public app_code: string;

    @Decorator.Attribute()
    public email: string;

    @Decorator.Attribute()
    public password: string;

    @Decorator.Attribute()
    public name: string;

    @Decorator.Attribute()
    public role: string;        // refer to UserRole

    @Decorator.Attribute()
    public phone: string;

    @Decorator.Attribute()
    public address1: string;
    @Decorator.Attribute()
    public address2: string;

    @Decorator.Attribute()
    public parent_app_code: string;    // admin or dealer post code.

    @Decorator.Attribute()
    public vat_no: number;

    @Decorator.Attribute()
    public company_no: number;

    @Decorator.Attribute()
    public business1: string;
    @Decorator.Attribute()
    public business2: string;
    @Decorator.Attribute()
    public business3: string;
    @Decorator.Attribute()
    public business4: string;
    
    @Decorator.Attribute()
    public image_url: string;
    @Decorator.Attribute()
    public color: string;

    @Decorator.Attribute()
    public vehicles: VehicleMeta[];

    @Decorator.Attribute()
    public last_used_at: string;

    @Decorator.Attribute()
    public postal_code: string;
    public lon: number;
    public lat: number;

    // AU settings
    @Decorator.Attribute()
    public invoice_cost_for_admin: number;
    @Decorator.Attribute()
    public garage_cost_for_admin: number;
    
    // garage params
    @Decorator.Attribute()
    public allow_repair: boolean;               // allow customer to search other garages for repair.

    @Decorator.Attribute()
    public allow_mot: boolean;                   // allow customer to search other garages for booking a mot.

    @Decorator.Attribute()
    public allow_service: boolean;              // allow customer to search other garages for booking service.

    @Decorator.Attribute()
    public mobile_mechanic_available: boolean;
    @Decorator.Attribute()
    public mobile_mechanic_range: number;

    @Decorator.Attribute()
    public created_at: string;

    @Decorator.Attribute()
    public updated_at: string;

    // Key && Index configuration
    @Decorator.HashPrimaryKey('app_code')
    public static readonly primary_key: Query.HashPrimaryKey<User, string>;

    @Decorator.HashGlobalSecondaryIndex('email')
    public static readonly email_key: Query.HashGlobalSecondaryIndex<User, string>;

    @Decorator.HashGlobalSecondaryIndex('parent_app_code')
    public static readonly parent_app_code_key: Query.HashGlobalSecondaryIndex<User, string>;

    // Serializer
    @Decorator.Writer()
    public static readonly writer: Query.Writer<User>;

    public isDealer = function () {
        return this.role == UserRole.USER_DEALER;
    }

    public isAdmin = function() {
        return this.role == UserRole.USER_ADMIN;
    }

    public isUser = function() {
        return this.role == UserRole.USER_CUSTOMER;
    }
}
