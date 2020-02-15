import {Config, Decorator, Query, Table} from "dynamo-types"

@Decorator.Table({name: "Policy"})
export class Policy extends Table {

    @Decorator.Attribute()
    public id: number;

    @Decorator.Attribute()
    public name: string;        // vehicle_reg+polic_no

    @Decorator.Attribute()
    public vehicle_reg: string;

    @Decorator.Attribute()
    public policy_no: number;

    @Decorator.Attribute()
    public level: string;       // 'Basic', 'Advanced', 'EasyDrive'

    @Decorator.Attribute()
    public started_at: string;

    public periods: number;     // month.

    @Decorator.Attribute()
    public expired_at: string;

    @Decorator.Attribute()
    public created_at: string;

    @Decorator.Attribute()
    public updated_at: string;

    // Key && Index configuration
    @Decorator.FullPrimaryKey('vehicle_reg', 'policy_no')
    public static readonly primary_key: Query.FullPrimaryKey<Policy, string, number>;

    // Serializer
    @Decorator.Writer()
    public static readonly writer: Query.Writer<Policy>;
}
