// Type definitions for Buy4Good app

export interface Category {
  id: string;
  name: string;
  icon: string;
  displayName: string;
}

export interface Merchant {
  id: string;
  name: string;
  logo: string;
  cashbackRate: number;
  category: string;
  url: string;
  description?: string;
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: string;
  pledgeId?: string;
}

export interface UserActivity {
  id: string;
  type: 'purchase' | 'donation' | 'cashback';
  merchant?: string;
  charity?: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}

export interface UserStats {
  totalDonations: number;
  totalCashback: number;
  totalPurchases: number;
  activeCharity?: Charity;
  splitPercentage: number;
}
