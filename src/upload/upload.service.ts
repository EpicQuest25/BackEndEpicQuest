import { BadRequestException, Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfilePicture } from './entities/profilepicture.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { AuthenticationService } from '../authentication/authentication.service';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private storage: Storage;
  private bucket = 'epicquest';

  constructor(
    @InjectRepository(ProfilePicture)
    private profilePictureRepository: Repository<ProfilePicture>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authservice: AuthenticationService,
  ) {
    const base64Creds = process.env.GOOGLE_CREDENTIALS_BASE64;
    if (!base64Creds) {
      throw new Error('GOOGLE_CREDENTIALS_BASE64 not found in environment');
    }

    const credentials = JSON.parse(Buffer.from(base64Creds, 'base64').toString('utf-8'));
    this.storage = new Storage({
      projectId: credentials.project_id,
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
    });
  }

  async uploadFile(file) {
    const bucket = this.storage.bucket(this.bucket);
    const blob = bucket.file(`websiteMatarials/${file.originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
      public: true,
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => reject(err));
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucket}/${blob.name}`;
        resolve(publicUrl);
      });
      blobStream.end(file.buffer);
    });
  }

  async create(header, file) {
    const decodeToken = await this.authservice.decodeToken(header);
    const user = await this.userRepository.findOne({
      where: { email: decodeToken },
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const existingProfilePicture = await this.profilePictureRepository.findOne({
      where: { user },
    });

    if (existingProfilePicture) {
      try {
        const bucketFile = this.storage
          .bucket(this.bucket)
          .file(existingProfilePicture.filename);
        await bucketFile.delete();
      } catch (error) {
        if (error.code === 404) {
          console.warn('Old profile picture not found in bucket. Proceeding to DB cleanup.');
        } else {
          console.error('Error deleting old image from GCS:', error.message);
          throw new BadRequestException('Failed to delete old profile picture from cloud.');
        }
      }

      try {
        await this.profilePictureRepository.remove(existingProfilePicture);
      } catch (error) {
        throw new BadRequestException('Failed to remove old profile picture record from database.');
      }
    }

    const fileExtension = extname(file.originalname);
    const folderName = 'User/ProfilePicture';
    const filename = `${folderName}/${user.id}-ProfilePicture-${uuidv4()}${fileExtension}`;

    try {
      const bucketFile = this.storage.bucket(this.bucket).file(filename);
      await bucketFile.save(file.buffer, {
        contentType: file.mimetype,
        resumable: false,
        public: true,
      });

      const publicUrl = `https://storage.googleapis.com/${this.bucket}/${filename}`;
      const profilePicture = this.profilePictureRepository.create({
        user,
        filename,
        link: publicUrl,
        size: file.size,
      });

      const saved = await this.profilePictureRepository.save(profilePicture);
      return {
        message: 'Image uploaded successfully',
        profilePicture: {
          link: saved.link,
          size: saved.size,
        },
      };
    } catch (error) {
      console.error('Error uploading file to Google Cloud:', error.message);
      throw new BadRequestException('Failed to upload and save profile picture.');
    }
  }

  async uploadLogoUpdate(file, existingImageLink) {
    if (existingImageLink) {
      const urlParts = new URL(existingImageLink);
      const objectKey = urlParts.pathname.replace(/^\/[^/]+\//, '');
      try {
        const bucketFile = this.storage.bucket(this.bucket).file(objectKey);
        await bucketFile.delete();
      } catch (err) {
        console.error('Error deleting existing image:', err);
        throw new Error('Error deleting existing image');
      }
    }

    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000);
    const random = `${timestamp}${randomNumber}`;
    const folderName = 'logo';
    const fileExtension = extname(file.originalname);
    const fileName = `${folderName}/${random}-image${fileExtension}`;

    try {
      const bucketFile = this.storage.bucket(this.bucket).file(fileName);
      await bucketFile.save(file.buffer, {
        contentType: file.mimetype,
        resumable: false,
        public: true,
      });

      const url = `https://storage.googleapis.com/${this.bucket}/${fileName}`;
      return { link: url };
    } catch (err) {
      console.error('Error uploading file:', err);
      throw new Error('Error uploading file');
    }
  }
}