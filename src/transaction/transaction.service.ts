import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { User } from '../user/entities/user.entity';
import { Agent } from '../agent/entities/agent.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const { userId, agentId, ...transactionData } = createTransactionDto;
    
    const transaction = new Transaction();
    Object.assign(transaction, transactionData);

    // Handle user association if userId is provided
    if (userId) {
      const user = await this.userRepository.findOne({ 
        where: { id: userId },
        relations: ['wallet']
      });
      
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      
      transaction.user = user;
      
      // Update user wallet if it exists
      if (user.wallet) {
        const previousAmount = user.wallet.amount;
        transaction.previousAmount = previousAmount.toString();
        
        user.wallet.amount += Number(transactionData.amount);
        transaction.updatedAmount = user.wallet.amount.toString();
        
        await this.userRepository.save(user);
      }
    }

    // Handle agent association if agentId is provided
    if (agentId) {
      const agent = await this.agentRepository.findOne({ where: { id: agentId } });
      
      if (!agent) {
        throw new NotFoundException(`Agent with ID ${agentId} not found`);
      }
      
      transaction.agent = agent;
      
      // Update agent amount
      const previousAmount = agent.amount;
      transaction.previousAmount = previousAmount.toString();
      
      agent.amount += Number(transactionData.amount);
      transaction.updatedAmount = agent.amount.toString();
      
      await this.agentRepository.save(agent);
    }

    // Generate a transaction ID if not provided
    if (!transaction.transactionId) {
      const now = Date.now();
      const datePart = now.toString().slice(-4);
      const randomPart = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(3, '0');
      transaction.transactionId = 'EPQT' + datePart + randomPart;
    }

    return this.transactionRepository.save(transaction);
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find({
      relations: ['user', 'agent'],
    });
  }

  async findOne(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['user', 'agent'],
    });
    
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    
    return transaction;
  }

  async findByTransactionId(transactionId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { transactionId },
      relations: ['user', 'agent'],
    });
    
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${transactionId} not found`);
    }
    
    return transaction;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.findOne(id);
    
    // Only allow updating certain fields
    if (updateTransactionDto.paymentRiskType) {
      transaction.paymentRiskType = updateTransactionDto.paymentRiskType;
    }
    
    if (updateTransactionDto.updatedAmount) {
      transaction.updatedAmount = updateTransactionDto.updatedAmount;
    }
    
    return this.transactionRepository.save(transaction);
  }

  async remove(id: number): Promise<void> {
    const transaction = await this.findOne(id);
    await this.transactionRepository.remove(transaction);
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async getAgentTransactions(agentId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { agent: { id: agentId } },
      relations: ['agent'],
    });
  }
}