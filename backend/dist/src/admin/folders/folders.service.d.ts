import { Model } from 'mongoose';
import { Folder } from './schemas/folder.schema';
import { CreateFolderDto } from './dto/create-folder.dto';
export declare class FoldersService {
    private folderModel;
    constructor(folderModel: Model<Folder>);
    findAll(filter?: any): Promise<(import("mongoose").Document<unknown, {}, Folder, {}, {}> & Folder & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    create(createFolderDto: CreateFolderDto): Promise<import("mongoose").Document<unknown, {}, Folder, {}, {}> & Folder & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    delete(id: string): Promise<import("mongodb").DeleteResult>;
}
