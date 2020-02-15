import {Config, Decorator, Query, Table} from "dynamo-types"

@Decorator.Table({name: "Reminder"})
export class Reminder extends Table {
    @Decorator.Attribute()
    public id: number;

    // @Decorator.Attribute()
    // public app_code: string;   // user's post code

    @Decorator.Attribute()
    public vehicle_reg: string;   // vehicle_reg

    @Decorator.Attribute()
    public name: string;

    @Decorator.Attribute()
    public descr: string;

    @Decorator.Attribute()
    public enabled: boolean;    // Enable/Disable this reminder.

    @Decorator.Attribute()
    public trigger_month: number;
    @Decorator.Attribute()
    public trigger_day: number;
    @Decorator.Attribute()
    public trigger_hour: number;
    @Decorator.Attribute()
    public trigger_minute: number;
    @Decorator.Attribute()
    public trigger_second: number;

    @Decorator.Attribute()
    public trigger_at: string;
    
    @Decorator.Attribute()
    public created_at: string;

    @Decorator.Attribute()
    public updated_at: string;

    // Key && Index configuration
    @Decorator.HashPrimaryKey('id')
    public static readonly primary_key: Query.HashPrimaryKey<Reminder, number>;

    @Decorator.HashGlobalSecondaryIndex('vehicle_reg')
    public static readonly vehicle_reg_key: Query.HashGlobalSecondaryIndex<Reminder, string>;

    // @Decorator.HashGlobalSecondaryIndex('app_code')
    // public static readonly app_code_key: Query.HashGlobalSecondaryIndex<Reminder, string>;

    // Serializer
    @Decorator.Writer()
    public static readonly writer: Query.Writer<Reminder>;
}
