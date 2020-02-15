// import {Config, Decorator, Query, Table} from "dynamo-types"

// @Decorator.Table({name: "Labour"})
// export class Labour extends Table
// {
//     @Decorator.Attribute()
//     public id: number;

//     @Decorator.Attribute()
//     public job_id: number;

//     @Decorator.Attribute()
//     public quote_code: string;

//     @Decorator.Attribute()
//     public hours: number;

//     @Decorator.Attribute()
//     public price: number;

//     @Decorator.Attribute()
//     public descr: string;

//     @Decorator.Attribute()
//     public created_at: string;
//     @Decorator.Attribute()
//     public updated_at: string;

//     @Decorator.FullPrimaryKey('job_id', 'id')
//     public static readonly primary_key: Query.FullPrimaryKey<Labour, number, number>;

//     // Serializer
//     @Decorator.Writer()
//     public static readonly writer: Query.Writer<Labour>;
// }

export class Labour
{
    public id: number;
    public hours: number;
    public price: number;
    public descr: string;
}
