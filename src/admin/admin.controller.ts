import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminJwtguardGuard } from '../authentication/admin-jwtguard.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('createAdmin')
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @UseGuards(AdminJwtguardGuard)
  @Get('findAllAdmin')
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('email') email?: string,
    @Query('adminId') adminId?: string,
  ) {
    return this.adminService.findAll(page, limit, role, status, email, adminId);
  }

  @UseGuards(AdminJwtguardGuard)
  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.adminService.findOneByEmail(email);
  }

  @UseGuards(AdminJwtguardGuard)
  @Patch('updateAdmin')
  update(@Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.updateByEmail(updateAdminDto);
  }

  @UseGuards(AdminJwtguardGuard)
  @Delete(':email')
  remove(@Param('email') email: string) {
    return this.adminService.removeByEmail(email);
  }
}