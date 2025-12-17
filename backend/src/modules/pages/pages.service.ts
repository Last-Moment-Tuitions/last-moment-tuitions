import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Page, PageDocument } from './entities/page.entity';

@Injectable()
export class PagesService {
  constructor(@InjectModel(Page.name) private pageModel: Model<PageDocument>) {}

  async create(createPageDto: CreatePageDto) {
    const pageData: any = { ...createPageDto };
    
    // Logic for Standard Pages: Inject Global Templates
    if (pageData.type === 'page' || !pageData.type) {
      const headerId = await this._getOrCreateTemplate(
        'global-header',
        'Global Header',
        '<div style="background:#fff; padding:15px; border-bottom:1px solid #ddd; position:sticky; top:0; z-index:50;"><strong>LOGO</strong> <a href="/">Home</a></div>',
        [{ tagName: 'div', style: { position: 'sticky', top: '0', 'z-index': '50', background: 'white', padding: '15px' }, content: '<strong>LOGO</strong> <a href="/">Home</a>' }]
      );

      const footerId = await this._getOrCreateTemplate(
        'global-footer',
        'Global Footer',
        '<div style="background:#111; color:#fff; padding:20px; text-align:center;">&copy; 2025 Last Moment Tuitions</div>',
        [{ tagName: 'div', style: { background: '#111', color: '#fff', padding: '30px', 'text-align': 'center' }, content: '&copy; 2025 Last Moment Tuitions' }]
      );

      // Inject if no components provided
      if (!pageData.gjsComponents || pageData.gjsComponents.length === 0) {
        pageData.gjsComponents = [
          { type: 'template-ref', attributes: { id: headerId.toString() } },
          { tagName: 'div', classes: ['main-content'], style: { 'min-height': '80vh', padding: '20px' }, content: 'Start building your page here...' },
          { type: 'template-ref', attributes: { id: footerId.toString() } }
        ];
        pageData.gjsHtml = `<template-ref id="${headerId}"></template-ref><div class="main-content" style="min-height:80vh; padding:20px;">Start building your page here...</div><template-ref id="${footerId}"></template-ref>`;
      }
    }

    const createdPage = new this.pageModel(pageData);
    return createdPage.save();
  }

  async findAll(query: any) {
    const { folder, type } = query;
    const filter: any = {};
    if (folder !== undefined) {
      filter.folder = (folder === 'null' || !folder) ? null : folder;
    }
    if (type) filter.type = type;

    return this.pageModel.find(filter)
      .select('title slug updatedAt folder type status viewCount')
      .sort({ updatedAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    return this.pageModel.findById(id).exec();
  }

  async findBySlug(slug: string) {
    return this.pageModel.findOne({ slug }).exec();
  }

  async update(id: string, updatePageDto: UpdatePageDto) {
    return this.pageModel.findByIdAndUpdate(id, updatePageDto, { new: true, runValidators: true }).exec();
  }

  async remove(id: string) {
    return this.pageModel.deleteOne({ _id: id }).exec();
  }

  async incrementView(id: string) {
    return this.pageModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true }).exec();
  }

  // Helper
  private async _getOrCreateTemplate(slug: string, title: string, html: string, components: any[]) {
    let template = await this.pageModel.findOne({ slug, type: 'template' }).exec();
    if (!template) {
      template = await new this.pageModel({
        title,
        slug,
        type: 'template',
        gjsHtml: html,
        gjsCss: '',
        gjsComponents: components
      }).save();
    }
    return template._id;
  }
}
