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
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Transaction } from './entities/transaction.entity';
import { UserJwtGuard } from '../authentication/user.jwt.guard';

@ApiTags('Transactions')
@ApiBearerAuth('JWT-auth')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @UseGuards(UserJwtGuard)
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully created.',
    type: Transaction,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  @UseGuards(UserJwtGuard)
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({
    status: 200,
    description: 'Return all transactions.',
    type: [Transaction],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  @UseGuards(UserJwtGuard)
  @ApiOperation({ summary: 'Get a transaction by ID' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the transaction.',
    type: Transaction,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Get('reference/:transactionId')
  @UseGuards(UserJwtGuard)
  @ApiOperation({ summary: 'Get a transaction by transaction ID' })
  @ApiParam({ name: 'transactionId', description: 'Transaction reference ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the transaction.',
    type: Transaction,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  findByTransactionId(@Param('transactionId') transactionId: string) {
    return this.transactionService.findByTransactionId(transactionId);
  }

  @Get('user/:userId')
  @UseGuards(UserJwtGuard)
  @ApiOperation({ summary: 'Get all transactions for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Return all transactions for the user.',
    type: [Transaction],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getUserTransactions(@Param('userId') userId: string) {
    return this.transactionService.getUserTransactions(+userId);
  }

  @Get('agent/:agentId')
  @UseGuards(UserJwtGuard)
  @ApiOperation({ summary: 'Get all transactions for an agent' })
  @ApiParam({ name: 'agentId', description: 'Agent ID' })
  @ApiResponse({
    status: 200,
    description: 'Return all transactions for the agent.',
    type: [Transaction],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getAgentTransactions(@Param('agentId') agentId: string) {
    return this.transactionService.getAgentTransactions(+agentId);
  }

  @Patch(':id')
  @UseGuards(UserJwtGuard)
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'The transaction has been successfully updated.',
    type: Transaction,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  @UseGuards(UserJwtGuard)
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'The transaction has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}