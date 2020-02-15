import { Mot } from "./mot";

import {Config, Decorator, Query, Table} from "dynamo-types"

@Decorator.Table({name: "VehicleUser"})
export class VehicleUser extends Table {
    @Decorator.Attribute()
    public reg_no: string;

    @Decorator.Attribute()
    public app_code: string;           // owner user post code

    @Decorator.Attribute()
    public created_at: string;

    @Decorator.Attribute()
    public updated_at: string;

    // Key && Index configuration
    @Decorator.HashPrimaryKey('reg_no')
    public static readonly primary_key: Query.HashPrimaryKey<VehicleUser, string>;
    
    // Serializer
    @Decorator.Writer()
    public static readonly writer: Query.Writer<VehicleUser>;
}
