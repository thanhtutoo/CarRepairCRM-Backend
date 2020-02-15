import {Config, Decorator, Query, Table} from "dynamo-types"

@Decorator.Table({name: "Order"})
export class Order extends Table {
    @Decorator.Attribute()
    public id: number;            // order number

    @Decorator.Attribute()
    public quote_code: string;      // quote code
    
    @Decorator.Attribute()
    public job_id: number;

    @Decorator.Attribute()
    public app_code: string;       // garage code.

    @Decorator.Attribute()
    public net: number;     // unit is Pound

    @Decorator.Attribute()
    public vat: number;             // unit is Pound

    @Decorator.Attribute()
    public total: number;  // Whole Quotation Cost. unit is Pound. claim_total + au_parts_total

    @Decorator.Attribute()
    public quantity: number;

    @Decorator.Attribute()
    public descr: string;

    @Decorator.Attribute()
    public created_at: string;

    @Decorator.Attribute()
    public updated_at: string;

    // Key && Index configuration
    @Decorator.HashPrimaryKey('id')
    public static readonly primary_key: Query.HashPrimaryKey<Order, number>;
    @Decorator.HashGlobalSecondaryIndex('quote_code')
    public static readonly quote_code_key: Query.HashGlobalSecondaryIndex<Order, string>;

    @Decorator.HashGlobalSecondaryIndex('job_id')
    public static readonly job_id_key: Query.HashGlobalSecondaryIndex<Order, number>;

    @Decorator.HashGlobalSecondaryIndex('app_code')
    public static readonly app_code_key: Query.HashGlobalSecondaryIndex<Order, string>;
    // Serializer
    @Decorator.Writer()
    public static readonly writer: Query.Writer<Order>;
}
