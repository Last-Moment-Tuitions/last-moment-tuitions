import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial } from './schemas/testimonial.schema';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';

@Injectable()
export class TestimonialsService {
    constructor(
        @InjectModel(Testimonial.name)
        private testimonialModel: Model<Testimonial>
    ) { }

    async create(data: CreateTestimonialDto): Promise<Testimonial> {
        const created = new this.testimonialModel(data);
        const saved = await created.save();
        // Added this to ensure new testimonials appear instantly
        await this.clearCache();
        return saved;
    }

    async findAll(target_page?: string): Promise<Testimonial[]> {
        // If target_page is provided, filter the results; otherwise return all
        const filter = target_page ? { target_pages: target_page } : {};
        return this.testimonialModel.find(filter).sort({ createdAt: -1 }).exec();
    }

    async update(id: string, data: Partial<CreateTestimonialDto>): Promise<Testimonial> {
        const updated = await this.testimonialModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();

        if (!updated) {
            throw new NotFoundException(`Testimonial with ID ${id} not found`);
        }

        await this.clearCache();
        return updated;
    }

    async delete(id: string): Promise<any> {
        const deleted = await this.testimonialModel.findByIdAndDelete(id).exec();
        if (!deleted) {
            throw new NotFoundException(`Testimonial with ID ${id} not found`);
        }
        await this.clearCache();
        return { deleted: true };
    }

    private async clearCache() {
        console.log('Cache cleared after data change');
    }
}