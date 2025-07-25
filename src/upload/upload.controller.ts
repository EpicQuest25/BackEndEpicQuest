import { Controller, Post, UseInterceptors, UploadedFile, Headers, Body, BadRequestException, UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { UserJwtGuard } from '../authentication/user.jwt.guard';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file) {
    const publicUrl = await this.uploadService.uploadFile(file);
    return { url: publicUrl };
  }

  @UseGuards(UserJwtGuard)
  @Post('profilePicture/')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'image/jpg',
          'image/png',
          'image/jpeg',
          'image/gif',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('File type must be jpeg, jpg, png, gif'), false);
        }
      },
    }),
  )
  @ApiOperation({ summary: 'Upload a profile picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a profile picture with Header',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile picture uploaded successfully.',
    schema: {
      example: {
        status: 'success',
        data: {
          message: 'Profile picture uploaded.',
          imageUrl: 'https://example.com/path/to/profile-picture.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Could occur if the file format is invalid or the file is not provided.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. Could occur due to unexpected issues.',
  })
  async ProfilePictureUpload(@Headers() header, @UploadedFile() file) {
    if (!file) {
      throw new BadRequestException('No file uploaded or invalid file format.');
    }
    return await this.uploadService.create(header, file);
  }

  @Post('uploadlogo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload or update an image document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload the previous link in this field in order to delete the file',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        existingImageLink: {
          type: 'string',
          example: '"https://example.com/path/to/existing/image.jpg"',
          description: 'Link to the existing image if you want to update it',
        },
      },
    },
  })
  async uploadImageUpdate(@UploadedFile() file, @Body('existingImageLink') existingImageLink: string) {
    try {
      const result = await this.uploadService.uploadLogoUpdate(file, existingImageLink);
      return result;
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}