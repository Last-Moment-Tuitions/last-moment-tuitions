import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Page } from './schemas/page.schema';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
    constructor(
        @InjectModel(Page.name) private pageModel: Model<Page>,
    ) { }

    async findAll(filter: any = {}) {
        if (filter.folder === 'null') {
            filter.folder = null;
        }
        return this.pageModel
            .find(filter)
            .select('title slug updatedAt folder type status viewCount')
            .sort({ updatedAt: -1 })
            .exec();
    }

    async findById(id: string) {
        return this.pageModel.findById(id).exec();
    }

    async findBySlug(slug: string) {
        return this.pageModel.findOne({ slug }).exec();
    }

    async create(createPageDto: CreatePageDto) {
        const createdPage = new this.pageModel(createPageDto);
        return createdPage.save();
    }

    async update(id: string, updatePageDto: UpdatePageDto) {
        return this.pageModel.findByIdAndUpdate(id, updatePageDto, {
            new: true,
            runValidators: true,
        }).exec();
    }

    async delete(id: string) {
        return this.pageModel.deleteOne({ _id: id }).exec();
    }

    async incrementView(id: string) {
        return this.pageModel.findByIdAndUpdate(
            id,
            { $inc: { viewCount: 1 } },
            { new: true },
        ).exec();
    }
}
