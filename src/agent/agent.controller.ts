import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AgentService } from './agent.service';
import { Agent } from './entities/agent.entity';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  create(@Body() createAgentDto: Partial<Agent>) {
    return this.agentService.create(createAgentDto);
  }

  @Get()
  findAll() {
    return this.agentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgentDto: Partial<Agent>) {
    return this.agentService.update(+id, updateAgentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agentService.remove(+id);
  }
}