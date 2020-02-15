import {Config, Decorator, Query, Table} from "dynamo-types"
import { VehicleMeta } from "./vehicle";

@Decorator.Table({name: "Garage"})
export class Garage extends Table {
    @Decorator.Attribute()
    public app_code: string;   // dealer's post code.

    @Decorator.Attribute()
    public name: string;

    @Decorator.Attribute()
    public services: any[];

    @Decorator.Attribute()
    public vehicles: VehicleMeta[];

    @Decorator.Attribute()
    public user_count: number;
    @Decorator.Attribute()
    public user_vehicle_count: number;

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

    // Geo location info
    @Decorator.Attribute()
    public lon: number;
    @Decorator.Attribute()
    public lat: number;
    @Decorator.Attribute()
    public postal_code;
    @Decorator.Attribute()
    public address;

    //
    @Decorator.Attribute()
    public image_url: string;
    @Decorator.Attribute()
    public color: string;

    @Decorator.Attribute()
    public created_at: string;

    @Decorator.Attribute()
    public updated_at: string;

    // Key && Index configuration
    @Decorator.HashPrimaryKey('app_code')
    public static readonly primary_key: Query.HashPrimaryKey<Garage, string>;

    // Serializer
    @Decorator.Writer()
    public static readonly writer: Query.Writer<Garage>;
}
