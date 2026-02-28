import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestimonialsController } from './testimonials.controller';
import { TestimonialsService } from './testimonials.service';
import { Testimonial, TestimonialSchema } from './schemas/testimonial.schema';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../../users/users.module';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Testimonial.name, schema: TestimonialSchema }
        ]),
        UsersModule,
        AuthModule,
    ],
    controllers: [TestimonialsController],
    providers: [TestimonialsService],
})
export class TestimonialsModule { }