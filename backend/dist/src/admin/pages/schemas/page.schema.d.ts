import { Document, Types } from 'mongoose';
export declare class Page extends Document {
    title: string;
    slug: string;
    metaDescription?: string;
    gjsComponents: any[];
    gjsStyles: any[];
    gjsHtml: string;
    gjsCss: string;
    type: 'page' | 'template';
    status: string;
    viewCount: number;
    folder: Types.ObjectId | null;
}
export declare const PageSchema: import("mongoose").Schema<Page, import("mongoose").Model<Page, any, any, any, Document<unknown, any, Page, any, {}> & Page & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Page, Document<unknown, {}, import("mongoose").FlatRecord<Page>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Page> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
