/**
 * Peeap SDK - Client for integrating with my.peeap.com
 */

import axios, { AxiosInstance } from 'axios';

const PEEAP_API_URL = process.env.PEEAP_API_URL || 'https://my.peeap.com/api/v1';
const PEEAP_API_KEY = process.env.PEEAP_API_KEY;

interface CheckoutSessionParams {
  merchant_id: string;
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
  split?: {
    platform_fee_percent: number;
  };
  hold_period_days?: number;
  success_url: string;
  cancel_url: string;
}

interface CheckoutSession {
  id: string;
  checkout_url: string;
  amount: number;
  currency: string;
  status: string;
  expires_at: string;
}

interface MerchantBalance {
  merchant_id: string;
  available_balance: number;
  pending_balance: number;
  currency: string;
  pending_payouts: Array<{
    order_id: string;
    amount: number;
    release_at: string;
  }>;
}

interface MerchantInfo {
  id: string;
  name: string;
  email: string;
  status: string;
}

interface RefundParams {
  transaction_id: string;
  amount: number;
  reason?: string;
}

interface Refund {
  id: string;
  transaction_id: string;
  amount: number;
  status: string;
  created_at: string;
}

class PeeapSDK {
  private client: AxiosInstance;

  constructor(apiKey?: string) {
    this.client = axios.create({
      baseURL: PEEAP_API_URL,
      headers: {
        'Authorization': `Bearer ${apiKey || PEEAP_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Create a checkout session for payment
   */
  async createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutSession> {
    const response = await this.client.post('/checkout/sessions', params);
    return response.data;
  }

  /**
   * Get merchant balance (available and pending)
   */
  async getMerchantBalance(merchantId: string): Promise<MerchantBalance> {
    const response = await this.client.get(`/merchants/${merchantId}/balance`);
    return response.data;
  }

  /**
   * Get merchant information
   */
  async getMerchant(merchantId: string): Promise<MerchantInfo> {
    const response = await this.client.get(`/merchants/${merchantId}`);
    return response.data;
  }

  /**
   * Get merchant transactions
   */
  async getMerchantTransactions(merchantId: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ data: any[]; pagination: any }> {
    const response = await this.client.get(`/merchants/${merchantId}/transactions`, { params });
    return response.data;
  }

  /**
   * Process a refund
   */
  async createRefund(params: RefundParams): Promise<Refund> {
    const response = await this.client.post('/refunds', params);
    return response.data;
  }

  /**
   * Verify SSO token
   */
  async verifyToken(token: string): Promise<{
    valid: boolean;
    user?: {
      id: string;
      email: string;
      name: string;
      merchant_id?: string;
    };
  }> {
    const response = await this.client.get('/auth/verify', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCode(code: string, redirectUri: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: {
      id: string;
      email: string;
      name: string;
      merchant_id?: string;
    };
  }> {
    const response = await this.client.post('/auth/token', {
      grant_type: 'authorization_code',
      code,
      client_id: process.env.PEEAP_CLIENT_ID,
      client_secret: process.env.PEEAP_CLIENT_SECRET,
      redirect_uri: redirectUri,
    });
    return response.data;
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    const response = await this.client.post('/auth/token', {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.PEEAP_CLIENT_ID,
      client_secret: process.env.PEEAP_CLIENT_SECRET,
    });
    return response.data;
  }
}

// Export singleton instance
export const peeapSDK = new PeeapSDK();

// Export class for custom instances
export { PeeapSDK };

// Export types
export type {
  CheckoutSessionParams,
  CheckoutSession,
  MerchantBalance,
  MerchantInfo,
  RefundParams,
  Refund,
};
