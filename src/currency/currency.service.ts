import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from './entities/currency.entity';
import { Repository } from 'typeorm';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  async create(dto: CreateCurrencyDto) {
    const data = await this.currencyRepository.findOne({
      where: { currency: dto.currency },
    });
    
    if (data) {
      throw new ConflictException(`The currency ${dto.currency} already existed`);
    }
    
    const kitty = this.currencyRepository.create(dto);
    return await this.currencyRepository.save(kitty);
  }

  async findAll() {
    return await this.currencyRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(currency: string) {
    const value = await this.currencyRepository.findOne({
      where: { currency },
    });
    
    if (!value) {
      throw new NotFoundException();
    }
    
    return value;
  }

  async update(updateCurrencyDto: UpdateCurrencyDto) {
    try {
      const value = await this.currencyRepository.findOne({
        where: { currency: updateCurrencyDto.currency },
      });
      
      if (!value) {
        throw new NotFoundException(`Currency '${updateCurrencyDto.currency}' not found`);
      }
      
      const result = await this.currencyRepository.update(value.id, updateCurrencyDto);
      
      if (result.affected === 0) {
        throw new InternalServerErrorException(`Failed to update currency '${updateCurrencyDto.currency}'`);
      }
      
      return { message: 'Currency updated successfully' };
    } catch (error) {
      console.error('Update currency error:', error);
      
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      
      throw new InternalServerErrorException('An unexpected error occurred while updating currency');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} currency`;
  }
}