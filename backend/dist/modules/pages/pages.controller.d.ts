import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
export declare class PagesController {
    private readonly pagesService;
    constructor(pagesService: PagesService);
    create(createPageDto: CreatePageDto): Promise<{
        success: boolean;
        data: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./entities/page.entity").Page, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/page.entity").Page & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./entities/page.entity").Page, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/page.entity").Page & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    findAll(query: any): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./entities/page.entity").Page, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/page.entity").Page & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./entities/page.entity").Page, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/page.entity").Page & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    findBySlug(slug: string): Promise<{
        success: boolean;
        data: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./entities/page.entity").Page, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/page.entity").Page & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./entities/page.entity").Page, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/page.entity").Page & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./entities/page.entity").Page, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/page.entity").Page & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./entities/page.entity").Page, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/page.entity").Page & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    update(id: string, updatePageDto: UpdatePageDto): Promise<{
        success: boolean;
        data: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./entities/page.entity").Page, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/page.entity").Page & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./entities/page.entity").Page, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/page.entity").Page & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        data: {};
    }>;
    incrementView(id: string): Promise<{
        success: boolean;
        views: number;
    }>;
}
