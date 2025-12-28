import { Model } from 'mongoose';
import { Page } from './schemas/page.schema';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
export declare class PagesService {
    private pageModel;
    constructor(pageModel: Model<Page>);
    findAll(filter?: any): Promise<(import("mongoose").Document<unknown, {}, Page, {}, {}> & Page & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, Page, {}, {}> & Page & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findBySlug(slug: string): Promise<import("mongoose").Document<unknown, {}, Page, {}, {}> & Page & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    create(createPageDto: CreatePageDto): Promise<import("mongoose").Document<unknown, {}, Page, {}, {}> & Page & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(id: string, updatePageDto: UpdatePageDto): Promise<import("mongoose").Document<unknown, {}, Page, {}, {}> & Page & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    delete(id: string): Promise<import("mongodb").DeleteResult>;
    incrementView(id: string): Promise<import("mongoose").Document<unknown, {}, Page, {}, {}> & Page & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
