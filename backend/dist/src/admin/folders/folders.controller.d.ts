import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
export declare class FoldersController {
    private readonly foldersService;
    constructor(foldersService: FoldersService);
    findAll(query: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/folder.schema").Folder, {}, {}> & import("./schemas/folder.schema").Folder & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    create(createFolderDto: CreateFolderDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/folder.schema").Folder, {}, {}> & import("./schemas/folder.schema").Folder & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    delete(id: string): Promise<import("mongodb").DeleteResult>;
}
