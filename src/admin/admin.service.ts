import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    const randomPassword = this.generateRandomPassword(8);
    
    const existed = await this.adminRepository.findOne({
      where: { email: createAdminDto.email },
    });
    
    if (existed) {
      throw new ConflictException(`Admin already existed with this email.`);
    }
    
    const admin = this.adminRepository.create({
      ...createAdminDto,
      password: randomPassword,
      role: 'Admin',
      status: 'Active',
      adminId: uuidv4(),
    });
    
    return await this.adminRepository.save(admin);
  }

  generateRandomPassword(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+=-';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  async findAll(page = 1, limit = 10, role?: string, status?: string, email?: string, adminId?: string) {
    const where: any = {};
    
    if (role) where.role = role;
    if (status) where.status = status;
    if (email) where.email = email;
    if (adminId) where.adminId = adminId;
    
    const [data, total] = await this.adminRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdDate: 'DESC' },
    });
    
    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOneByEmail(email: string) {
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) {
      throw new NotFoundException(`Admin with email ${email} not found`);
    }
    return admin;
  }

  async updateByEmail(updateAdminDto: UpdateAdminDto) {
    const admin = await this.findOneByEmail(updateAdminDto.email);
    Object.assign(admin, updateAdminDto);
    return this.adminRepository.save(admin);
  }

  async removeByEmail(email: string) {
    const admin = await this.findOneByEmail(email);
    await this.adminRepository.remove(admin);
    return { message: `Deletion SuccessFull for ${email}` };
  }
}