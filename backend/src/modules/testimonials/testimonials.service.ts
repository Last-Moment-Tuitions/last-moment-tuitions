import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial } from './schemas/testimonial.schema';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import Redis from 'ioredis';

@Injectable()
export class TestimonialsService {
    constructor(
        @InjectModel(Testimonial.name) private testimonialModel: Model<Testimonial>,
        @Inject('REDIS_CLIENT') private readonly redis: Redis,
    ) { }

    async findByPage(pageName: string) {
        // 1. ADMIN LOGIC: If 'all', fetch everything from DB (bypass cache for management)
        if (pageName === 'all') {
            return this.testimonialModel.find().sort({ createdAt: -1 }).exec();
        }

        const cacheKey = `testimonials:page:${pageName}`;

        // 2. CACHE LOGIC: Try Redis first for student-facing pages
        const cached = await this.redis.get(cacheKey);
        if (cached) return JSON.parse(cached);

        // 3. DB FALLBACK: Filter by the target page tag
        const testimonials = await this.testimonialModel
            .find({ target_pages: pageName })
            .sort({ createdAt: -1 })
            .exec();

        // 4. SET CACHE: Store for 1 hour if data exists
        if (testimonials.length > 0) {
            await this.redis.setex(cacheKey, 3600, JSON.stringify(testimonials));
        }

        return testimonials;
    }

    async create(data: CreateTestimonialDto) {
        const created = new this.testimonialModel(data);
        const saved = await created.save();
        await this.clearCache();
        return saved;
    }

    async update(id: string, data: Partial<CreateTestimonialDto>) {
        const updated = await this.testimonialModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();
        await this.clearCache();
        return updated;
    }

    async delete(id: string) {
        const result = await this.testimonialModel.findByIdAndDelete(id).exec();
        await this.clearCache();
        return result;
    }

    // Helper to wipe Redis keys whenever data changes
    private async clearCache() {
        const keys = await this.redis.keys('testimonials:page:*');
        if (keys.length > 0) {
            await this.redis.del(...keys);
            console.log('⚡ Redis Cache Cleared for Testimonials');
        }
    }
}