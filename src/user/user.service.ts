import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  // In-memory users array for when database is not available
  private users: any[] = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      password: '$2b$10$7EoMAR8E6xZZrXf6Jnz1B.Nv4LD.5ZBOoaJRGd7TLdmYcJRnEZYnS', // hashed 'password123'
      phone: '1234567890',
      isVerified: true,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Test User',
      email: 'user@example.com',
      password: '$2b$10$7EoMAR8E6xZZrXf6Jnz1B.Nv4LD.5ZBOoaJRGd7TLdmYcJRnEZYnS', // hashed 'password123'
      phone: '0987654321',
      isVerified: true,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      
      // Try to use database if available
      if (this.userRepository) {
        const user = this.userRepository.create({
          ...createUserDto,
          password: hashedPassword,
        });
        return this.userRepository.save(user);
      } else {
        // Use in-memory array if database is not available
        const newUser = {
          id: this.users.length + 1,
          ...createUserDto,
          password: hashedPassword,
          isVerified: false,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.users.push(newUser);
        return newUser;
      }
    } catch (error) {
      // Fallback to in-memory array if database operation fails
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = {
        id: this.users.length + 1,
        ...createUserDto,
        password: hashedPassword,
        isVerified: false,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.push(newUser);
      return newUser;
    }
  }

  async findAll(): Promise<any[]> {
    try {
      if (this.userRepository) {
        return this.userRepository.find();
      } else {
        return this.users;
      }
    } catch (error) {
      return this.users;
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      if (this.userRepository) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
      } else {
        const user = this.users.find(user => user.id === id);
        if (!user) {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
      }
    } catch (error) {
      const user = this.users.find(user => user.id === id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    }
  }

  async findByEmail(email: string): Promise<any> {
    try {
      if (this.userRepository) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
          throw new NotFoundException(`User with email ${email} not found`);
        }
        return user;
      } else {
        const user = this.users.find(user => user.email === email);
        if (!user) {
          throw new NotFoundException(`User with email ${email} not found`);
        }
        return user;
      }
    } catch (error) {
      const user = this.users.find(user => user.email === email);
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    try {
      if (this.userRepository) {
        const user = await this.findOne(id);
        
        if (updateUserDto.password) {
          updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        
        Object.assign(user, updateUserDto);
        return this.userRepository.save(user);
      } else {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        
        if (updateUserDto.password) {
          updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        
        this.users[userIndex] = {
          ...this.users[userIndex],
          ...updateUserDto,
          updatedAt: new Date(),
        };
        
        return this.users[userIndex];
      }
    } catch (error) {
      const userIndex = this.users.findIndex(user => user.id === id);
      if (userIndex === -1) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      
      this.users[userIndex] = {
        ...this.users[userIndex],
        ...updateUserDto,
        updatedAt: new Date(),
      };
      
      return this.users[userIndex];
    }
  }

  async remove(id: number): Promise<void> {
    try {
      if (this.userRepository) {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);
      } else {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        this.users.splice(userIndex, 1);
      }
    } catch (error) {
      const userIndex = this.users.findIndex(user => user.id === id);
      if (userIndex === -1) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      this.users.splice(userIndex, 1);
    }
  }
}