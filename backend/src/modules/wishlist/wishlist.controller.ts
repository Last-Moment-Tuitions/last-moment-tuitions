import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { SyncWishlistDto } from './dto/sync-wishlist.dto';

@Controller('wishlist')
@UseGuards(AuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async getWishlist(@Req() req: any) {
    const userId = req.user.userId;
    const wishlist = await this.wishlistService.getWishlist(userId);
    return { success: true, data: wishlist };
  }

  @Post('add')
  async addItem(@Req() req: any, @Body() addToWishlistDto: AddToWishlistDto) {
    const userId = req.user.userId;
    const wishlist = await this.wishlistService.addItem(userId, addToWishlistDto.course_id);
    return { success: true, data: wishlist };
  }

  @Delete('remove/:courseId')
  async removeItem(@Req() req: any, @Param('courseId') courseId: string) {
    const userId = req.user.userId;
    const wishlist = await this.wishlistService.removeItem(userId, courseId);
    return { success: true, data: wishlist };
  }

  @Post('sync')
  async syncWishlist(@Req() req: any, @Body() syncWishlistDto: SyncWishlistDto) {
    const userId = req.user.userId;
    const wishlist = await this.wishlistService.syncWishlist(userId, syncWishlistDto);
    return { success: true, data: wishlist };
  }
}
