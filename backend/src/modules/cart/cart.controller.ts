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
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { SyncCartDto } from './dto/sync-cart.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: any) {
    const userId = req.user.userId;
    const cart = await this.cartService.getCart(userId);
    return { success: true, data: cart };
  }

  @Post('add')
  async addItem(@Req() req: any, @Body() addToCartDto: AddToCartDto) {
    const userId = req.user.userId;
    const cart = await this.cartService.addItem(userId, addToCartDto.course_id);
    return { success: true, data: cart };
  }

  @Delete('remove/:courseId')
  async removeItem(@Req() req: any, @Param('courseId') courseId: string) {
    const userId = req.user.userId;
    const cart = await this.cartService.removeItem(userId, courseId);
    return { success: true, data: cart };
  }

  @Post('sync')
  async syncCart(@Req() req: any, @Body() syncCartDto: SyncCartDto) {
    const userId = req.user.userId;
    const cart = await this.cartService.syncCart(userId, syncCartDto);
    return { success: true, data: cart };
  }

  @Post('clear')
  async clearCart(@Req() req: any) {
    const userId = req.user.userId;
    const cart = await this.cartService.clearCart(userId);
    return { success: true, data: cart };
  }
}
