export interface Session {
  isAuthenticated: boolean;
  customerName?: string;
  cardNetwork?: string;
  cardToken?: string | null;
  bin?: string | null;
  last4?: string | null;
}

export interface MoneyMutationResponse {
  balance: string;
}

export interface PinLoginResponse {
  customerName: string;
  cardNetwork: string;
}

export interface BalanceResponse {
  balance: string;
}
