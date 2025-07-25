import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PaymentLinkRequestDto } from './adyan.dto';

@Injectable()
export class AdyenService {
  private apiKey: string;
  private merchantAccount: string;

  constructor() {
    this.apiKey = process.env.ADYEN_API_KEY;
    this.merchantAccount = process.env.ADYEN_MERCHANT_ACCOUNT;
  }

  async createPaymentLink(paymentRequest: PaymentLinkRequestDto) {
    const convertedAmount = {
      currency: paymentRequest.amount.currency,
      value: Math.round(paymentRequest.amount.value * 100),
    };

    const expiresAt = new Date(Date.now() + 20 * 60 * 1000).toISOString();
    const returnUrl = 'https://epicquest.netlify.app';

    try {
      new URL(returnUrl);
    } catch (err) {
      throw new Error(`Invalid returnUrl: ${returnUrl}`);
    }

    const payload_data = {
      amount: convertedAmount,
      reference: paymentRequest.reference,
      returnUrl,
      additionalData: {
        allowPaymentMethods: ['scheme', 'ideal'],
      },
      merchantAccount: this.merchantAccount,
      expiresAt,
    };

    const shoppingRequest = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.ADYEN_API_URL}/v71/paymentLinks`,
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': this.apiKey,
      },
      data: payload_data,
    };

    try {
      const response = await axios.request(shoppingRequest);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || error.message;
      console.error('Error generating payment link:', errorData);
      throw new Error(`Payment link creation failed: ${JSON.stringify(errorData)}`);
    }
  }

  async verifyPayment(details: { redirectResult?: string; payload?: string }) {
    const payload = {
      paymentData: details.redirectResult || details.payload,
      merchantAccount: this.merchantAccount,
    };

    const shoppingRequest = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.ADYEN_API_URL}/v69/payments/details`,
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': this.apiKey,
      },
      data: payload,
    };

    try {
      const response = await axios.request(shoppingRequest);
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  async paymentDetails(id: string) {
    const requestConfig = {
      method: 'get',
      url: `${process.env.ADYEN_API_URL}/v68/payments/${id}`,
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': this.apiKey,
      },
    };

    try {
      const response = await axios.request(requestConfig);
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error.response ? error.response.data : error.message);
      throw new Error('Payment verification failed');
    }
  }
}