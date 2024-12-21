'use client';

import { SessionProvider as NextAuthProvider } from 'next-auth/react';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function SessionProvider({ children, ...props }: ThemeProviderProps) {
  return <NextAuthProvider {...props}>{children}</NextAuthProvider>;
}
