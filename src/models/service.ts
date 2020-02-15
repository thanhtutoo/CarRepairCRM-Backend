import {Config, Decorator, Query, Table} from "dynamo-types"

@Decorator.Table({name: "Service"})
export class Service extends Table {

    @Decorator.Attribute()
    public id: number;

    @Decorator.Attribute()
    public name: string;

    @Decorator.Attribute()
    public price: number;       // pound per monthly price.

    @Decorator.Attribute()
    public created_at: string;

    @Decorator.Attribute()
    public updated_at: string;

    // Key && Index configuration
    @Decorator.HashPrimaryKey('id')
    public static readonly primary_key: Query.HashPrimaryKey<Service, number>;

    // Serializer
    @Decorator.Writer()
    public static readonly writer: Query.Writer<Service>;
}
