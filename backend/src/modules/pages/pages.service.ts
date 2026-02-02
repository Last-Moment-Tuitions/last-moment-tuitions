import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Page, PageDocument } from './entities/page.entity';
import { Folder, FolderDocument } from '../folders/entities/folder.entity';
import { PageStatus } from './enums/page-status.enum';

@Injectable()
export class PagesService {
  constructor(
    @InjectModel(Page.name) private pageModel: Model<PageDocument>,
    @InjectModel(Folder.name) private folderModel: Model<FolderDocument>
  ) { }

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

    // Resolved hardcoded status
    if (filter.status === undefined) {
      filter.status = PageStatus.PUBLISHED;
    }

    return this.pageModel.find(filter)
      .select('title slug updatedAt folder type status viewCount')
      .sort({ updatedAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    // Resolved hardcoded status
    return this.pageModel.findOne({ _id: id, status: PageStatus.PUBLISHED }).exec();
  }

  async findBySlug(slug: string) {
    // Resolved hardcoded status
    return this.pageModel.findOne({ slug, status: PageStatus.PUBLISHED }).exec();
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

  async getNavHierarchy() {
    // 1. Fetch all folders
    const folders = await this.folderModel.find({ type: 'page' }).sort({ name: 1 }).exec();

    // 2. Fetch all published pages - Resolved hardcoded status
    const pages = await this.pageModel.find({
      type: 'page',
      status: PageStatus.PUBLISHED
    }).select('title slug folder').sort({ title: 1 }).exec();

    // 3. Build hierarchy
    const hierarchy = [];

    // Root Pages (no folder)
    const rootPages = pages.filter(p => !p.folder);
    rootPages.forEach(p => {
      hierarchy.push({
        type: 'link',
        label: p.title,
        href: `/${p.slug}`
      });
    });

    // Folders with their pages
    folders.forEach(folder => {
      const folderPages = pages.filter(p => p.folder?.toString() === folder._id.toString());
      if (folderPages.length > 0) {
        hierarchy.push({
          type: 'dropdown',
          label: folder.name,
          items: folderPages.map(p => ({
            label: p.title,
            href: `/${p.slug}`
          }))
        });
      }
    });

    return hierarchy;
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
        gjsComponents: components,
        status: PageStatus.PUBLISHED // Templates should default to published to be usable
      }).save();
    }
    return template._id;
  }
}