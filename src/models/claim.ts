import {Config, Decorator, Query, Table} from "dynamo-types"

@Decorator.Table({name: "Claim"})
export class Claim extends Table {
    @Decorator.Attribute()
    public code: string;                // claim registration number

    @Decorator.Attribute()
    public app_code: string;           // garage code

    @Decorator.Attribute()
    public vehicle_reg: string;

    @Decorator.Attribute()
    public mileage: number;

    @Decorator.Attribute()
    public vehicle_diagnosed_before: boolean;

    @Decorator.Attribute()
    public claim_registered_before: boolean;

    @Decorator.Attribute()
    public descr: string;

    @Decorator.Attribute()
    public job_id: number;
    
    @Decorator.Attribute()
    public created_at: string;

    @Decorator.Attribute()
    public updated_at: string;

    // Key && Index configuration
    @Decorator.HashPrimaryKey('code')
    public static readonly primary_key: Query.HashPrimaryKey<Claim, string>;

    @Decorator.HashGlobalSecondaryIndex('vehicle_reg')
    public static readonly vehicle_reg_key: Query.HashGlobalSecondaryIndex<Claim, string>;

    // Serializer
    @Decorator.Writer()
    public static readonly writer: Query.Writer<Claim>;
}
