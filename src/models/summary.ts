import {Config, Decorator, Query, Table} from "dynamo-types"

@Decorator.Table({name: "Summary"})
export class Summary extends Table {
    @Decorator.Attribute()
    public year_month: string;           // year_month, 2019-01

    @Decorator.Attribute()
    public due_mots: number;             // vehicles count mot due at

    @Decorator.Attribute()
    public due_services: number;         // vehicles count sevice due at 

    @Decorator.Attribute()
    public availables: number;           // vehicles count available at. ****This is no need to use****

    @Decorator.Attribute()
    public booked_repairs: number;      // vehicles booked at repairing.

    @Decorator.Attribute()
    public booked_mots: number;         // vehicles booked at mots .

    @Decorator.Attribute()
    public booked_services: number;     // vehicles booked at repairing.

    @Decorator.Attribute()
    public booked_availables: number;   // vehicles not booked at.      **** This is no need to use****

    @Decorator.Attribute()
    public app_code: string;           // garage post code

    @Decorator.Attribute()
    public created_at: string;

    @Decorator.Attribute()
    public updated_at: string;

    // Key && Index configuration
    @Decorator.FullPrimaryKey('app_code', 'year_month')
    public static readonly primary_key: Query.FullPrimaryKey<Summary, string, string>;

    // Serializer
    @Decorator.Writer()
    public static readonly writer: Query.Writer<Summary>;
}
