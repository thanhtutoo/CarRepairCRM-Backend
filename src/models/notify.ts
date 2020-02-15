import {Config, Decorator, Query, Table} from "dynamo-types"

@Decorator.Table({name: "Notify"})
export class Notify extends Table {
    @Decorator.Attribute()
    public id: number;

    @Decorator.Attribute()
    public from_app_code: string;

    @Decorator.Attribute()
    public to_email: string;

    @Decorator.Attribute()
    public to_app_code: string;

    @Decorator.Attribute()
    public subject: string;
    
    @Decorator.Attribute()
    public message: string;

    @Decorator.Attribute()
    public quote_code: string;
    @Decorator.Attribute()
    public type: string;        // 'quote' | 'invoice'

    @Decorator.Attribute()
    public readen: boolean;

    @Decorator.Attribute()
    public readen_at: string;

    @Decorator.Attribute()
    public attachment: string;
    @Decorator.Attribute()
    public attachment_type: string;
    @Decorator.Attribute()
    public attachment_size: number; // in bytes

    @Decorator.Attribute()
    public created_at: string;

    @Decorator.Attribute()
    public updated_at: string;

    // Key && Index configuration
    @Decorator.HashPrimaryKey('id')
    public static readonly primary_key: Query.HashPrimaryKey<Notify, number>;

    @Decorator.HashGlobalSecondaryIndex('to_app_code')
    public static readonly to_app_code_key: Query.HashGlobalSecondaryIndex<Notify, string>;

    @Decorator.FullGlobalSecondaryIndex('to_email', 'id')
    public static readonly to_email_id_key: Query.FullGlobalSecondaryIndex<Notify, string, number>;

    // Serializer
    @Decorator.Writer()
    public static readonly writer: Query.Writer<Notify>;
}
