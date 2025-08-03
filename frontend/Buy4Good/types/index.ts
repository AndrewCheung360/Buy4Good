export type User = {
  $id: string;
  email: string;
  firstName: string;
  lastName: string;
  charities: string[];
  totalDonationAmount: number;
};

export type BankAccount = {
  id: string;
  userId: string;
  bankName: string;
  accountNumberHash: string;
  accountTye: string;
  isActive: boolean;
};

export type Transaction = {
  id: string;
  userId: string;
  accountId: string;
  originalAmount: number;
  donationAmount: number;
  merchantName: string;
  status: string;
};

export type Category = {
  id: string;
  name: string;
  displayName: string;
  icon: string;
};

export type Merchant = {
  id: string;
  name: string;
  logo: string;
  cashbackRate: number;
  category: string;
  url: string;
  description: string;
};
