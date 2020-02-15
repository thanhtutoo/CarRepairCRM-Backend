import {Config, Decorator, Query, Table} from "dynamo-types"

@Decorator.Table({name: "Reapir"})
export class Repair extends Table {
    @Decorator.Attribute()
    public code: string;                // repair, service, mot Request registration number

    @Decorator.Attribute()
    public app_code: string;           // garage code

    @Decorator.Attribute()
    public type: string;

    @Decorator.Attribute()
    public vehicle_reg: string;

    @Decorator.Attribute()
    public booked_at: string;

    @Decorator.Attribute()
    public descr: string;

    @Decorator.Attribute()
    public services: string[];

    @Decorator.Attribute()
    public job_id: number;

    @Decorator.Attribute()
    public created_at: string;

    @Decorator.Attribute()
    public updated_at: string;

    // Key && Index configuration
    @Decorator.HashPrimaryKey('code')
    public static readonly primary_key: Query.HashPrimaryKey<Repair, string>;

    // Serializer
    @Decorator.Writer()
    public static readonly writer: Query.Writer<Repair>;
}
