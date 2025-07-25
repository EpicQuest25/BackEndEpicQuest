import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from './entities/agent.entity';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
  ) {}

  // Basic methods for CRUD operations
  async findAll(): Promise<Agent[]> {
    return this.agentRepository.find();
  }

  async findOne(id: number): Promise<Agent> {
    return this.agentRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Agent> {
    return this.agentRepository.findOne({ where: { email } });
  }

  async create(agentData: Partial<Agent>): Promise<Agent> {
    const agent = this.agentRepository.create(agentData);
    return this.agentRepository.save(agent);
  }

  async update(id: number, agentData: Partial<Agent>): Promise<Agent> {
    await this.agentRepository.update(id, agentData);
    return this.agentRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.agentRepository.delete(id);
  }
}