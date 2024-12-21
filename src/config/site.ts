import { Icons } from '@/components/icons';
import { env } from '@/env.mjs';
import { SiteConfig } from '@/types';

export const OPEN_SOURCE_URL = 'https://github.com/lixvyang';

export const siteConfig: SiteConfig = {
  name: 'DomeFi',
  author: 'lixv',
  description:
    'DomeFi is a decentralized autonomous organization (DAO) that operates on a decentralized network of computers.',
  keywords: [
    'DomeFi',
    'Mixin',
    'DAO',
    'Decentralized',
    'Autonomous',
    'Organization',
    'Network',
    'Computers',
  ],
  url: {
    base: env.NEXT_PUBLIC_APP_URL,
    author: 'https://github.com/lixvyang',
  },
  headerLinks: [{ name: 'repo', href: OPEN_SOURCE_URL, icon: Icons.github }],
  links: {
    github: OPEN_SOURCE_URL,
  },
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.png?${new Date().getTime()}`,
};
