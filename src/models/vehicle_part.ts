// import {Config, Decorator, Query, Table} from "dynamo-types"

// @Decorator.Table({name: "VehiclePart"})
// export class VehiclePart extends Table
// {
//     @Decorator.Attribute()
//     public id: number;

//     @Decorator.Attribute()
//     public job_id: number;
    
//     @Decorator.Attribute()
//     public quote_code: string;

//     @Decorator.Attribute()
//     public quantity: number;

//     @Decorator.Attribute()
//     public price: number;

//     @Decorator.Attribute()
//     public descr: string;

//     @Decorator.Attribute()
//     public created_at: string;

//     @Decorator.Attribute()
//     public updated_at: string;

//     // public vehicle_reg: string;

//     @Decorator.FullPrimaryKey('job_id', 'id')
//     public static readonly primary_key: Query.FullPrimaryKey<VehiclePart, number, number>;

//     // Serializer
//     @Decorator.Writer()
//     public static readonly writer: Query.Writer<VehiclePart>;
// }

export class VehiclePart
{
    public id: number;
    public quantity: number;
    public price: number;
    public descr: string;
}
