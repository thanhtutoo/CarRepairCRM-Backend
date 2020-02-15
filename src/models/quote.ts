import {Config, Decorator, Query, Table} from "dynamo-types"
import { Labour } from "./labour";
import { VehiclePart } from "./vehicle_part";

@Decorator.Table({name: "Quote"})
export class Quote extends Table {

    @Decorator.Attribute()
    public code: string;
    
    @Decorator.Attribute()
    public job_id: number;

    @Decorator.Attribute()
    public app_code: string;       // garage code.

    @Decorator.Attribute()
    public parts_total: number;     // unit is Pound

    @Decorator.Attribute()
    public labour_total: number;    // unit is Pound

    @Decorator.Attribute()
    public au_parts_total: number;   // unit is Pound

    @Decorator.Attribute()
    public claim_total: number;     // parts_total + labout_total + au_parts_total + vat

    @Decorator.Attribute()
    public vat_needed: boolean;
    
    @Decorator.Attribute()
    public vat: number;             // unit is Pound

    @Decorator.Attribute()
    public invoiced_total: number;  // Whole Quotation Cost. unit is Pound. claim_total + au_parts_total

    @Decorator.Attribute()
    public is_invoiced: boolean;
    @Decorator.Attribute()
    public is_paid: boolean;

    @Decorator.Attribute()
    public labours: Labour[];
    @Decorator.Attribute()
    public vehicle_parts: VehiclePart[];

    @Decorator.Attribute()
    public cause_failure: string;
    @Decorator.Attribute()
    public repairs_required: string;

    @Decorator.Attribute()
    public created_at: string;

    @Decorator.Attribute()
    public updated_at: string;

    // Key && Index configuration
    @Decorator.HashPrimaryKey('code')
    public static readonly primary_key: Query.HashPrimaryKey<Quote, string>;

    @Decorator.HashGlobalSecondaryIndex('job_id')
    public static readonly job_id_key: Query.HashGlobalSecondaryIndex<Quote, number>;

    @Decorator.HashGlobalSecondaryIndex('app_code')
    public static readonly app_code_key: Query.HashGlobalSecondaryIndex<Quote, string>;
    // Serializer
    @Decorator.Writer()
    public static readonly writer: Query.Writer<Quote>;
}
