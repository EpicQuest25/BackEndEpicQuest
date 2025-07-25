import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post()
  create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currencyService.create(createCurrencyDto);
  }

  @Get('allCurrency')
  findAll() {
    return this.currencyService.findAll();
  }

  @Get('singleValue')
  findOne(@Query('value') value: string) {
    return this.currencyService.findOne(value);
  }

  @Patch('update')
  async update(@Body() updateCurrencyDto: UpdateCurrencyDto) {
    return await this.currencyService.update(updateCurrencyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.currencyService.remove(+id);
  }
}