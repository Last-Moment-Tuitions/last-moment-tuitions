import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const order_id = `ORD-${uuidv4().split('-')[0].toUpperCase()}-${Date.now().toString().slice(-4)}`;
    
    const newOrder = new this.orderModel({
      ...createOrderDto,
      order_id,
      status: 'pending_payment',
    });
    
    return newOrder.save();
  }

  async getOrderById(order_id: string): Promise<Order> {
    return this.orderModel.findOne({ order_id }).exec();
  }
}
