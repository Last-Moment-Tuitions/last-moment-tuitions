import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
export declare class FoldersController {
    private readonly foldersService;
    constructor(foldersService: FoldersService);
    create(createFolderDto: CreateFolderDto): Promise<{
        success: boolean;
        data: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./entities/folder.entity").Folder, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/folder.entity").Folder & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./entities/folder.entity").Folder, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/folder.entity").Folder & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    findAll(query: any): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./entities/folder.entity").Folder, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/folder.entity").Folder & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./entities/folder.entity").Folder, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/folder.entity").Folder & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./entities/folder.entity").Folder, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/folder.entity").Folder & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./entities/folder.entity").Folder, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/folder.entity").Folder & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    update(id: string, updateFolderDto: UpdateFolderDto): Promise<{
        success: boolean;
        data: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./entities/folder.entity").Folder, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/folder.entity").Folder & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./entities/folder.entity").Folder, {}, import("mongoose").DefaultSchemaOptions> & import("./entities/folder.entity").Folder & {
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
}
