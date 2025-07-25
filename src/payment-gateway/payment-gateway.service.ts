import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from '../agent/entities/agent.entity';
import { Transection } from '../transection/entities/transection.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

interface WebhookData {
  merchantReference?: string;
  additionalData?: {
    paymentLinkId?: string;
  };
  amount?: {
    currency?: string;
    value?: number;
  };
  pspReference?: string;
  eventCode?: string;
}

@Injectable()
export class PaymentGatewayService {
  constructor(
    @InjectRepository(Transection)
    private readonly transectionRepo: Repository<Transection>,
    @InjectRepository(Agent)
    private readonly agentRepo: Repository<Agent>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async saveWebhookData(data: WebhookData): Promise<void> {
    const reference = data?.merchantReference;
    const paymentLinkId = data?.additionalData?.paymentLinkId;
    const currency = data?.amount?.currency;
    const value = String(Number(data?.amount?.value) / 100);
    const pspReference = data?.pspReference;

    const user = await this.userRepo.findOne({
      where: { email: reference },
      relations: ['wallet'],
    });

    let previousAmount = '0';
    let updatedAmount = value;

    if (user?.wallet) {
      previousAmount = user.wallet.amount.toString();
      user.wallet.amount += Number(value);
      updatedAmount = user.wallet.amount.toString();
      await this.userRepo.save(user);
    }

    const agent = await this.agentRepo.findOne({ where: { email: reference } });
    if (agent) {
      previousAmount = agent.amount.toString();
      agent.amount += Number(value);
      updatedAmount = agent.amount.toString();
      await this.agentRepo.save(agent);
    }

    const now = Date.now();
    const datePart = now.toString().slice(-4);
    const randomPart = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(3, '0');
    const randomId = 'EPQT' + datePart + randomPart;

    const transaction = new Transection();
    transaction.transectionId = randomId;
    transaction.gatewayData = data;
    transaction.paymentRiskType = data?.eventCode;
    transaction.gatewayReferance = pspReference;
    transaction.gatewayid = paymentLinkId;
    transaction.currency = currency;
    transaction.amount = value;
    transaction.updatedAmount = updatedAmount;
    transaction.previousAmount = previousAmount;
    transaction.agent = agent || null;
    transaction.user = user || null;

    await this.transectionRepo.save(transaction);
  }
}