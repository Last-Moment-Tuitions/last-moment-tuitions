import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
export declare class PagesController {
    private readonly pagesService;
    constructor(pagesService: PagesService);
    findAll(query: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/page.schema").Page, {}, {}> & import("./schemas/page.schema").Page & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/page.schema").Page, {}, {}> & import("./schemas/page.schema").Page & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findBySlug(slug: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/page.schema").Page, {}, {}> & import("./schemas/page.schema").Page & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    create(createPageDto: CreatePageDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/page.schema").Page, {}, {}> & import("./schemas/page.schema").Page & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(id: string, updatePageDto: UpdatePageDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/page.schema").Page, {}, {}> & import("./schemas/page.schema").Page & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    delete(id: string): Promise<import("mongodb").DeleteResult>;
    incrementView(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/page.schema").Page, {}, {}> & import("./schemas/page.schema").Page & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
