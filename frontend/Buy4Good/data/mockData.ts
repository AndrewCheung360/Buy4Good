// Mock data for categories and merchants

import { Category, Merchant } from '@/types';

export const mockCategories: Category[] = [
  {
    id: 'clothing',
    name: 'clothing',
    displayName: 'Clothing &\nAccessories',
    icon: '👕'
  },
  {
    id: 'food',
    name: 'food',
    displayName: 'Food &\nGroceries',
    icon: '🥘'
  },
  {
    id: 'electronics',
    name: 'electronics',
    displayName: 'Electronics',
    icon: '🎮'
  },
  {
    id: 'tools',
    name: 'tools',
    displayName: 'Tools & DIY',
    icon: '🔧'
  },
  {
    id: 'kids',
    name: 'kids',
    displayName: 'Kids & Baby',
    icon: '🛒'
  },
  {
    id: 'education',
    name: 'education',
    displayName: 'Work &\nEducation',
    icon: '💼'
  }
];

export const mockMerchants: Record<string, Merchant[]> = {
  clothing: [
    {
      id: 'zara',
      name: 'ZARA',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Zara-Logo.png',
      cashbackRate: 2.5,
      category: 'clothing',
      url: 'https://zara.com',
      description: 'Fast fashion retailer'
    },
    {
      id: 'hm',
      name: 'H&M',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/HM-Logo.png',
      cashbackRate: 3.0,
      category: 'clothing',
      url: 'https://hm.com',
      description: 'Affordable fashion'
    },
    {
      id: 'target',
      name: 'Target',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Target-Logo.png',
      cashbackRate: 1.5,
      category: 'clothing',
      url: 'https://target.com',
      description: 'Department store'
    },
    {
      id: 'oldnavy',
      name: 'Old Navy',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Old-Navy-Logo.png',
      cashbackRate: 2.0,
      category: 'clothing',
      url: 'https://oldnavy.com',
      description: 'Casual clothing'
    },
    {
      id: 'jcrew',
      name: 'J.Crew',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/J-Crew-Logo.png',
      cashbackRate: 4.0,
      category: 'clothing',
      url: 'https://jcrew.com',
      description: 'Premium casual wear'
    },
    {
      id: 'americaneagle',
      name: 'American Eagle',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/American-Eagle-Logo.png',
      cashbackRate: 3.5,
      category: 'clothing',
      url: 'https://ae.com',
      description: 'Youth fashion'
    }
  ],
  food: [
    {
      id: 'uber-eats',
      name: 'Uber Eats',
      logo: 'https://logos-world.net/wp-content/uploads/2020/05/Uber-Eats-Logo.png',
      cashbackRate: 2.0,
      category: 'food',
      url: 'https://ubereats.com',
      description: 'Food delivery'
    },
    {
      id: 'doordash',
      name: 'DoorDash',
      logo: 'https://logos-world.net/wp-content/uploads/2020/05/DoorDash-Logo.png',
      cashbackRate: 1.5,
      category: 'food',
      url: 'https://doordash.com',
      description: 'Food delivery'
    },
    {
      id: 'whole-foods',
      name: 'Whole Foods',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Whole-Foods-Logo.png',
      cashbackRate: 3.0,
      category: 'food',
      url: 'https://wholefoodsmarket.com',
      description: 'Organic groceries'
    }
  ],
  electronics: [
    {
      id: 'apple',
      name: 'Apple',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png',
      cashbackRate: 1.0,
      category: 'electronics',
      url: 'https://apple.com',
      description: 'Consumer electronics'
    },
    {
      id: 'bestbuy',
      name: 'Best Buy',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Best-Buy-Logo.png',
      cashbackRate: 2.5,
      category: 'electronics',
      url: 'https://bestbuy.com',
      description: 'Electronics retailer'
    },
    {
      id: 'amazon',
      name: 'Amazon',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png',
      cashbackRate: 2.0,
      category: 'electronics',
      url: 'https://amazon.com',
      description: 'Online marketplace'
    }
  ]
};

export const recentSearches = [
  'anthropology',
  'aritzia',
  'sephora',
  'nike'
];
