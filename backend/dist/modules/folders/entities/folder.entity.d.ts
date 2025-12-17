import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
export type FolderDocument = HydratedDocument<Folder>;
export declare class Folder {
    name: string;
    parent: MongooseSchema.Types.ObjectId;
    type: string;
}
export declare const FolderSchema: MongooseSchema<Folder, import("mongoose").Model<Folder, any, any, any, import("mongoose").Document<unknown, any, Folder, any, import("mongoose").DefaultSchemaOptions> & Folder & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any, Folder>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Folder, import("mongoose").Document<unknown, {}, Folder, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Folder & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Folder, import("mongoose").Document<unknown, {}, Folder, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Folder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    parent?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId, Folder, import("mongoose").Document<unknown, {}, Folder, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Folder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<string, Folder, import("mongoose").Document<unknown, {}, Folder, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Folder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Folder>;
