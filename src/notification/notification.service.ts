import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { Supplier } from '../supplier/entities/supplier.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async create(moduleName: string, reason: string, actionBy: string): Promise<void> {
    const date = new Date().toISOString();
    let newNotification = new Notification();
    newNotification.moduleName = moduleName;
    newNotification.actionBy = actionBy;
    newNotification.reason = reason;
    newNotification.date = date;
    await this.notificationRepository.save(newNotification);
  }

  async findAll(): Promise<Notification[]> {
    return await this.notificationRepository.find({ order: { id: 'DESC' } });
  }

  async hasRole(supplierEmail: string, roleName: string): Promise<boolean> {
    const supplier = await this.supplierRepository.findOne({
      where: { email: supplierEmail },
      relations: ['roles'],
    });

    if (!supplier) {
      throw new NotFoundException(`No supplier found with email ${supplierEmail}`);
    }

    return supplier.roles.some((role) => role.roleName === roleName);
  }
}