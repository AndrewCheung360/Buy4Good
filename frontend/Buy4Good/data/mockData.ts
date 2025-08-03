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
    },
    {
      id: 'mcdonalds',
      name: 'McDonald\'s',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/McDonalds-Logo.png',
      cashbackRate: 2.5,
      category: 'food',
      url: 'https://mcdonalds.com',
      description: 'Fast food'
    },
    {
      id: 'starbucks',
      name: 'Starbucks',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Starbucks-Logo.png',
      cashbackRate: 4.0,
      category: 'food',
      url: 'https://starbucks.com',
      description: 'Coffee chain'
    },
    {
      id: 'subway',
      name: 'Subway',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Subway-Logo.png',
      cashbackRate: 3.5,
      category: 'food',
      url: 'https://subway.com',
      description: 'Sandwich chain'
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
    },
    {
      id: 'samsung',
      name: 'Samsung',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Samsung-Logo.png',
      cashbackRate: 1.5,
      category: 'electronics',
      url: 'https://samsung.com',
      description: 'Mobile & electronics'
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Microsoft-Logo.png',
      cashbackRate: 2.0,
      category: 'electronics',
      url: 'https://microsoft.com',
      description: 'Software & hardware'
    },
    {
      id: 'sony',
      name: 'Sony',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Sony-Logo.png',
      cashbackRate: 3.0,
      category: 'electronics',
      url: 'https://sony.com',
      description: 'Entertainment electronics'
    }
  ],
  tools: [
    {
      id: 'homedepot',
      name: 'Home Depot',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Home-Depot-Logo.png',
      cashbackRate: 2.0,
      category: 'tools',
      url: 'https://homedepot.com',
      description: 'Home improvement'
    },
    {
      id: 'lowes',
      name: 'Lowe\'s',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Lowes-Logo.png',
      cashbackRate: 2.5,
      category: 'tools',
      url: 'https://lowes.com',
      description: 'Home improvement'
    },
    {
      id: 'harbor-freight',
      name: 'Harbor Freight',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Harbor-Freight-Logo.png',
      cashbackRate: 3.0,
      category: 'tools',
      url: 'https://harborfreight.com',
      description: 'Discount tools'
    },
    {
      id: 'dewalt',
      name: 'DeWalt',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/DeWalt-Logo.png',
      cashbackRate: 1.5,
      category: 'tools',
      url: 'https://dewalt.com',
      description: 'Power tools'
    },
    {
      id: 'milwaukee',
      name: 'Milwaukee Tool',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Milwaukee-Logo.png',
      cashbackRate: 2.0,
      category: 'tools',
      url: 'https://milwaukeetool.com',
      description: 'Professional tools'
    },
    {
      id: 'craftsman',
      name: 'Craftsman',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Craftsman-Logo.png',
      cashbackRate: 2.5,
      category: 'tools',
      url: 'https://craftsman.com',
      description: 'Hand & power tools'
    }
  ],
  kids: [
    {
      id: 'toysrus',
      name: 'Toys"R"Us',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Toys-R-Us-Logo.png',
      cashbackRate: 3.0,
      category: 'kids',
      url: 'https://toysrus.com',
      description: 'Toy retailer'
    },
    {
      id: 'babiesrus',
      name: 'Babies"R"Us',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Babies-R-Us-Logo.png',
      cashbackRate: 2.5,
      category: 'kids',
      url: 'https://babiesrus.com',
      description: 'Baby products'
    },
    {
      id: 'carter',
      name: 'Carter\'s',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Carters-Logo.png',
      cashbackRate: 4.0,
      category: 'kids',
      url: 'https://carters.com',
      description: 'Baby & kids clothing'
    },
    {
      id: 'gap-kids',
      name: 'Gap Kids',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Gap-Logo.png',
      cashbackRate: 3.5,
      category: 'kids',
      url: 'https://gap.com/kids',
      description: 'Kids clothing'
    },
    {
      id: 'disney-store',
      name: 'Disney Store',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Disney-Logo.png',
      cashbackRate: 2.0,
      category: 'kids',
      url: 'https://disneystore.com',
      description: 'Disney merchandise'
    },
    {
      id: 'lego',
      name: 'LEGO',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/LEGO-Logo.png',
      cashbackRate: 1.5,
      category: 'kids',
      url: 'https://lego.com',
      description: 'Building toys'
    }
  ],
  education: [
    {
      id: 'staples',
      name: 'Staples',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Staples-Logo.png',
      cashbackRate: 2.5,
      category: 'education',
      url: 'https://staples.com',
      description: 'Office supplies'
    },
    {
      id: 'office-depot',
      name: 'Office Depot',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Office-Depot-Logo.png',
      cashbackRate: 2.0,
      category: 'education',
      url: 'https://officedepot.com',
      description: 'Office supplies'
    },
    {
      id: 'coursera',
      name: 'Coursera',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Coursera-Logo.png',
      cashbackRate: 5.0,
      category: 'education',
      url: 'https://coursera.org',
      description: 'Online courses'
    },
    {
      id: 'udemy',
      name: 'Udemy',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Udemy-Logo.png',
      cashbackRate: 4.5,
      category: 'education',
      url: 'https://udemy.com',
      description: 'Online learning'
    },
    {
      id: 'linkedin-learning',
      name: 'LinkedIn Learning',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/LinkedIn-Logo.png',
      cashbackRate: 3.0,
      category: 'education',
      url: 'https://linkedin.com/learning',
      description: 'Professional development'
    },
    {
      id: 'khan-academy',
      name: 'Khan Academy',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Khan-Academy-Logo.png',
      cashbackRate: 0.0,
      category: 'education',
      url: 'https://khanacademy.org',
      description: 'Free education'
    }
  ]
};

export const recentSearches = [
  'apple',
  'zara',
  'starbucks',
  'home depot'
];
