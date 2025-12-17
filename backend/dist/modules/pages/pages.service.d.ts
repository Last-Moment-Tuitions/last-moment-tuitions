import { Model } from 'mongoose';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Page, PageDocument } from './entities/page.entity';
export declare class PagesService {
    private pageModel;
    constructor(pageModel: Model<PageDocument>);
    create(createPageDto: CreatePageDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Page, {}, import("mongoose").DefaultSchemaOptions> & Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Page, {}, import("mongoose").DefaultSchemaOptions> & Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(query: any): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Page, {}, import("mongoose").DefaultSchemaOptions> & Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Page, {}, import("mongoose").DefaultSchemaOptions> & Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOne(id: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Page, {}, import("mongoose").DefaultSchemaOptions> & Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Page, {}, import("mongoose").DefaultSchemaOptions> & Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    findBySlug(slug: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Page, {}, import("mongoose").DefaultSchemaOptions> & Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Page, {}, import("mongoose").DefaultSchemaOptions> & Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    update(id: string, updatePageDto: UpdatePageDto): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Page, {}, import("mongoose").DefaultSchemaOptions> & Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Page, {}, import("mongoose").DefaultSchemaOptions> & Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    remove(id: string): Promise<import("mongodb").DeleteResult>;
    incrementView(id: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Page, {}, import("mongoose").DefaultSchemaOptions> & Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Page, {}, import("mongoose").DefaultSchemaOptions> & Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    private _getOrCreateTemplate;
}
