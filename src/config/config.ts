import { Landmark, Trophy, Wallet } from 'lucide-react';

type NavItem = {
  name: 'Lend' | 'Points' | 'Portfolio'; // 确保 name 是有效键
  link: string;
  icon: React.ElementType;
};

export const navConfig: NavItem[] = [
  {
    name: 'Lend',
    icon: Landmark,
    link: '/lend',
  },
  {
    name: 'Points',
    icon: Trophy,
    link: '/points',
  },
  {
    name: 'Portfolio',
    icon: Wallet,
    link: '/portfolio',
  },
];
