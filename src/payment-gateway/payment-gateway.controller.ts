import { Controller, Post, Body, BadRequestException, Get, Query } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';
import { AdyenService } from './payment-gatewayList/adyenService';
import { PaymentLinkRequestDto } from './payment-gatewayList/adyan.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('payment-gateway')
export class PaymentGatewayController {
  constructor(
    private readonly adyenService: AdyenService,
    private readonly paymentGatewayService: PaymentGatewayService,
  ) {}

  @Post('adyen/create-link')
  async createPaymentLink(@Body() paymentLinkRequest: PaymentLinkRequestDto) {
    const paymentLink = await this.adyenService.createPaymentLink(paymentLinkRequest);
    return { paymentLink };
  }

  @Post('adyenWebhook')
  async handleAdyenWebhook(@Body() body: any) {
    if (!body.notificationItems) {
      throw new BadRequestException('Invalid Adyen webhook payload');
    }

    for (const item of body.notificationItems) {
      const notification = item.NotificationRequestItem;
      const eventCode = notification.eventCode;
      const success = notification.success === 'true';
      const merchantReference = notification.merchantReference;
      const pspReference = notification.pspReference;

      if (eventCode === 'AUTHORISATION' && success) {
        await this.paymentGatewayService.saveWebhookData(notification);
      } else if (eventCode === 'CANCELLATION') {
        // Handle cancellation if needed
      }
    }

    return '[accepted]';
  }

  @Get('payemntDetailsWithId')
  @ApiQuery({
    name: 'id',
    required: true,
    description: 'The payment ID to fetch details',
  })
  async paymentDetails(@Query('id') id: string) {
    return await this.adyenService.paymentDetails(id);
  }
}