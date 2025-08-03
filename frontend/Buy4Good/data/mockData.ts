// Mock data for categories and merchants

import { Category, Merchant } from "@/types";

export const mockCategories: Category[] = [
  {
    id: "clothing",
    name: "clothing",
    displayName: "Clothing &\nAccessories",
    icon: "👕",
  },
  {
    id: "food",
    name: "food",
    displayName: "Food &\nGroceries",
    icon: "🥘",
  },
  {
    id: "electronics",
    name: "electronics",
    displayName: "Electronics",
    icon: "🎮",
  },
  {
    id: "tools",
    name: "tools",
    displayName: "Tools & DIY",
    icon: "🔧",
  },
  {
    id: "kids",
    name: "kids",
    displayName: "Kids & Baby",
    icon: "🛒",
  },
  {
    id: "education",
    name: "education",
    displayName: "Work &\nEducation",
    icon: "💼",
  },
];

export const mockMerchants: Record<string, Merchant[]> = {
  clothing: [
    {
      id: "zara",
      name: "ZARA",
      logo: "https://logos-world.net/wp-content/uploads/2020/05/Zara-Logo-700x394.png",
      cashbackRate: 2.5,
      category: "clothing",
      url: "https://zara.com",
      description: "Fast fashion retailer",
    },
    {
      id: "adidas",
      name: "Adidas",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png",
      cashbackRate: 3.0,
      category: "clothing",
      url: "https://adidas.com",
      description: "Sportswear",
    },
    {
      id: "allbirds",
      name: "Allbirds",
      logo: "https://cdn.worldvectorlogo.com/logos/allbirds.svg",
      cashbackRate: 2.5,
      category: "clothing",
      url: "https://allbirds.com",
      description: "Sustainable footwear",
    },
    {
      id: "aritzia",
      name: "Aritzia",
      logo: "https://download.logo.wine/logo/Aritzia/Aritzia-Logo.wine.png",
      cashbackRate: 3.5,
      category: "clothing",
      url: "https://aritzia.com",
      description: "Women's fashion",
    },
    {
      id: "americaneagle",
      name: "American Eagle",
      logo: "https://logos-world.net/wp-content/uploads/2023/01/American-Eagle-Logo-500x281.png",
      cashbackRate: 3.0,
      category: "clothing",
      url: "https://ae.com",
      description: "Youth fashion",
    },
    {
      id: "hm",
      name: "H&M",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/HM-Logo.png",
      cashbackRate: 3.0,
      category: "clothing",
      url: "https://hm.com",
      description: "Affordable fashion",
    },
  ],
  food: [
    {
      id: "aesop",
      name: "Aesop",
      logo: "https://logos-world.net/wp-content/uploads/2023/01/Aesop-Logo-500x281.png",
      cashbackRate: 2.0,
      category: "food",
      url: "https://aesop.com",
      description: "Skincare and cosmetics",
    },
    {
      id: "uber-eats",
      name: "Uber Eats",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/Uber-Eats-Logo-700x394.png",
      cashbackRate: 2.0,
      category: "food",
      url: "https://ubereats.com",
      description: "Food delivery",
    },
    {
      id: "starbucks",
      name: "Starbucks",
      logo: "https://logos-world.net/wp-content/uploads/2020/09/Starbucks-Logo-700x394.png",
      cashbackRate: 4.0,
      category: "food",
      url: "https://starbucks.com",
      description: "Coffee chain",
    },
    {
      id: "whole-foods",
      name: "Whole Foods",
      logo: "https://logos-world.net/wp-content/uploads/2021/12/Whole-Foods-Logo-500x281.png",
      cashbackRate: 3.0,
      category: "food",
      url: "https://wholefoodsmarket.com",
      description: "Organic groceries",
    },
  ],
  electronics: [
    {
      id: "apple",
      name: "Apple",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png",
      cashbackRate: 1.0,
      category: "electronics",
      url: "https://apple.com",
      description: "Consumer electronics",
    },
    {
      id: "bestbuy",
      name: "Best Buy",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/Best-Buy-Logo-700x394.png",
      cashbackRate: 2.5,
      category: "electronics",
      url: "https://bestbuy.com",
      description: "Electronics retailer",
    },
    {
      id: "amazon",
      name: "Amazon",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png",
      cashbackRate: 2.0,
      category: "electronics",
      url: "https://amazon.com",
      description: "Online marketplace",
    },
    {
      id: "samsung",
      name: "Samsung",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Samsung-Logo.png",
      cashbackRate: 1.5,
      category: "electronics",
      url: "https://samsung.com",
      description: "Mobile & electronics",
    },
  ],
  kids: [
    {
      id: "target",
      name: "Target",
      logo: "https://logos-world.net/wp-content/uploads/2020/10/Target-Logo-700x394.png",
      cashbackRate: 1.5,
      category: "kids",
      url: "https://target.com",
      description: "Department store",
    },
    {
      id: "carter",
      name: "Carter's",
      logo: "https://1000logos.net/wp-content/uploads/2020/02/Carters-Logo.png",
      cashbackRate: 3.0,
      category: "kids",
      url: "https://carters.com",
      description: "Children's clothing",
    },
  ],
  tools: [
    {
      id: "homedepot",
      name: "Home Depot",
      logo: "https://logos-world.net/wp-content/uploads/2021/08/Home-Depot-Logo-700x394.png",
      cashbackRate: 2.0,
      category: "tools",
      url: "https://homedepot.com",
      description: "Home improvement",
    },
  ],
  education: [
    {
      id: "staples",
      name: "Staples",
      logo: "https://logos-world.net/wp-content/uploads/2021/10/Staples-Logo-700x394.png",
      cashbackRate: 2.5,
      category: "education",
      url: "https://staples.com",
      description: "Office supplies",
    },
  ],
};

// Mock data for recent activities
export interface ActivityItem {
  id: string;
  organization: string;
  activity: string;
  amount: string;
  icon: string;
  date?: string;
}

export const mockRecentActivities: ActivityItem[] = [
  {
    id: "1",
    organization: "Red Cross",
    activity: "Disaster Relief Fund",
    amount: "$15.75",
    icon: "🩸",
    date: "2 hours ago",
  },
  {
    id: "2",
    organization: "Feeding America",
    activity: "Hunger Relief Program",
    amount: "$8.25",
    icon: "🍽️",
    date: "1 day ago",
  },
  {
    id: "3",
    organization: "St. Jude Children's Hospital",
    activity: "Childhood Cancer Research",
    amount: "$22.50",
    icon: "🏥",
    date: "2 days ago",
  },
  {
    id: "4",
    organization: "World Wildlife Fund",
    activity: "Wildlife Conservation",
    amount: "$12.00",
    icon: "🐼",
    date: "3 days ago",
  },
  {
    id: "5",
    organization: "Doctors Without Borders",
    activity: "Medical Aid Program",
    amount: "$18.90",
    icon: "🚑",
    date: "1 week ago",
  },
  {
    id: "6",
    organization: "UNICEF",
    activity: "Children's Education Fund",
    amount: "$9.45",
    icon: "📚",
    date: "1 week ago",
  },
  {
    id: "7",
    organization: "Habitat for Humanity",
    activity: "Home Building Project",
    amount: "$14.20",
    icon: "🏠",
    date: "2 weeks ago",
  },
  {
    id: "8",
    organization: "American Cancer Society",
    activity: "Cancer Research Fund",
    amount: "$11.30",
    icon: "🎗️",
    date: "2 weeks ago",
  },
];
