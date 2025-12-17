import { Model } from 'mongoose';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { Folder, FolderDocument } from './entities/folder.entity';
export declare class FoldersService {
    private folderModel;
    constructor(folderModel: Model<FolderDocument>);
    create(createFolderDto: CreateFolderDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Folder, {}, import("mongoose").DefaultSchemaOptions> & Folder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Folder, {}, import("mongoose").DefaultSchemaOptions> & Folder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(query: any): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Folder, {}, import("mongoose").DefaultSchemaOptions> & Folder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Folder, {}, import("mongoose").DefaultSchemaOptions> & Folder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOne(id: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Folder, {}, import("mongoose").DefaultSchemaOptions> & Folder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Folder, {}, import("mongoose").DefaultSchemaOptions> & Folder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    update(id: string, updateFolderDto: UpdateFolderDto): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Folder, {}, import("mongoose").DefaultSchemaOptions> & Folder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Folder, {}, import("mongoose").DefaultSchemaOptions> & Folder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    remove(id: string): Promise<import("mongodb").DeleteResult>;
}
