import {Config, Decorator, Query, Table} from "dynamo-types"

@Decorator.Table({name: "Warranty"})
export class Warranty extends Table {
    @Decorator.Attribute()
    public id: number;

    @Decorator.Attribute()
    public app_code: string;
    
    @Decorator.Attribute()
    public vehicle_reg: string;

    @Decorator.Attribute()
    public mileage: number;

    @Decorator.Attribute()
    public services: number[];

    @Decorator.Attribute()
    public cover: string;       // 0, 1, 2

    @Decorator.Attribute()
    public periods: number;     // month;

    @Decorator.Attribute()
    public created_at: string;

    @Decorator.Attribute()
    public updated_at: string;

    // Key && Index configuration
    @Decorator.HashPrimaryKey('id')
    public static readonly primary_key: Query.HashPrimaryKey<Warranty, number>;

    // Serializer
    @Decorator.Writer()
    public static readonly writer: Query.Writer<Warranty>;
}
