import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TourPackageService } from './tour-package.service';
import { CreateTourPackageDto } from './dto/create-tour-package.dto';
import { UpdateTourPackageDto } from './dto/update-tour-package.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TourPackage } from './entities/tourPackage.model';
import { UserJwtGuard } from '../authentication/user.jwt.guard';

@ApiTags('Tour Packages')
@ApiBearerAuth('JWT-auth')
@Controller('tour-packages')
export class TourPackageController {
  constructor(private readonly tourPackageService: TourPackageService) {}

  @Post()
  @UseGuards(UserJwtGuard)
  @ApiOperation({ summary: 'Create a new tour package' })
  @ApiResponse({
    status: 201,
    description: 'The tour package has been successfully created.',
    type: TourPackage,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() createTourPackageDto: CreateTourPackageDto) {
    return this.tourPackageService.create(createTourPackageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tour packages' })
  @ApiResponse({
    status: 200,
    description: 'Return all tour packages.',
    type: [TourPackage],
  })
  findAll() {
    return this.tourPackageService.findAll();
  }

  @Get('type/:packageType')
  @ApiOperation({ summary: 'Get tour packages by type' })
  @ApiParam({ name: 'packageType', description: 'Package type' })
  @ApiResponse({
    status: 200,
    description: 'Return tour packages by type.',
    type: [TourPackage],
  })
  findByType(@Param('packageType') packageType: string) {
    return this.tourPackageService.findByType(packageType);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get tour packages by status' })
  @ApiParam({ name: 'status', description: 'Package status' })
  @ApiResponse({
    status: 200,
    description: 'Return tour packages by status.',
    type: [TourPackage],
  })
  findByStatus(@Param('status') status: string) {
    return this.tourPackageService.findByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tour package by ID' })
  @ApiParam({ name: 'id', description: 'Tour package ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the tour package.',
    type: TourPackage,
  })
  @ApiResponse({ status: 404, description: 'Tour package not found.' })
  findOne(@Param('id') id: string) {
    return this.tourPackageService.findOne(+id);
  }

  @Get('package/:packageId')
  @ApiOperation({ summary: 'Get a tour package by package ID' })
  @ApiParam({ name: 'packageId', description: 'Tour package reference ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the tour package.',
    type: TourPackage,
  })
  @ApiResponse({ status: 404, description: 'Tour package not found.' })
  findByPackageId(@Param('packageId') packageId: string) {
    return this.tourPackageService.findByPackageId(packageId);
  }

  @Patch(':id')
  @UseGuards(UserJwtGuard)
  @ApiOperation({ summary: 'Update a tour package' })
  @ApiParam({ name: 'id', description: 'Tour package ID' })
  @ApiResponse({
    status: 200,
    description: 'The tour package has been successfully updated.',
    type: TourPackage,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Tour package not found.' })
  update(
    @Param('id') id: string,
    @Body() updateTourPackageDto: UpdateTourPackageDto,
  ) {
    return this.tourPackageService.update(+id, updateTourPackageDto);
  }

  @Delete(':id')
  @UseGuards(UserJwtGuard)
  @ApiOperation({ summary: 'Delete a tour package' })
  @ApiParam({ name: 'id', description: 'Tour package ID' })
  @ApiResponse({
    status: 200,
    description: 'The tour package has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Tour package not found.' })
  remove(@Param('id') id: string) {
    return this.tourPackageService.remove(+id);
  }
}