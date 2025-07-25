import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto, addRolesToSupplier, updateRole } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { AdminJwtguardGuard } from '../authentication/admin-jwtguard.guard';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SupplierJwtGuard } from '../authentication/supplier-jwt.guard';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.create(createSupplierDto);
  }

  @ApiBearerAuth('token')
  @UseGuards(AdminJwtguardGuard)
  @Get('admin/allSupplier')
  @ApiQuery({ name: 'role', required: false, type: [String], isArray: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'email', required: false })
  findAll(
    @Query('role') role: any,
    @Query('page') page: any = 1,
    @Query('limit') limit: any = 10,
    @Query('email') email: string,
  ) {
    const roles = Array.isArray(role) ? role : role ? [role] : [];
    return this.supplierService.findAll(Number(page), Number(limit), roles, email);
  }

  @UseGuards(SupplierJwtGuard)
  @Get('findOneUser/')
  findOne(@Query('email') email: string) {
    return this.supplierService.findOne(email);
  }

  @UseGuards(SupplierJwtGuard)
  @Patch('updateSupplier')
  update(@Body() updateSupplierDto: UpdateSupplierDto) {
    return this.supplierService.update(updateSupplierDto);
  }

  @UseGuards(AdminJwtguardGuard)
  @Delete('admin/deleteSupplier')
  remove(@Query('email') email: string) {
    return this.supplierService.remove(email);
  }

  @UseGuards(AdminJwtguardGuard)
  @Patch('admin/updateStatus')
  async adminAction(@Body() updateSupplierDto: updateRole) {
    return this.supplierService.updateRole(updateSupplierDto);
  }

  @UseGuards(AdminJwtguardGuard)
  @Post('admin/assignToSupplier')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign a role to a supplier by email' })
  @ApiResponse({ status: 200, description: 'Role assigned successfully' })
  @ApiResponse({ status: 404, description: 'Supplier not found' })
  async assignRoleToSupplier(@Body() data: addRolesToSupplier) {
    return this.supplierService.assignRoleTOSupplier(data);
  }
}