import { Document, Types } from 'mongoose';
export declare class Folder extends Document {
    name: string;
    parent: Types.ObjectId | null;
    type: 'page' | 'template';
}
export declare const FolderSchema: import("mongoose").Schema<Folder, import("mongoose").Model<Folder, any, any, any, Document<unknown, any, Folder, any, {}> & Folder & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Folder, Document<unknown, {}, import("mongoose").FlatRecord<Folder>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Folder> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
