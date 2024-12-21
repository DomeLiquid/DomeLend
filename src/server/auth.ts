import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from 'next-auth';

import { env } from '@/env.mjs';
import { getJwtToken } from '@/lib/actions';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      // ...other properties
      role: UserRole;
      accessToken: string;
      jwtToken: string;
    } & DefaultSession['user'];
  }
}

type UserRole = 'admin' | 'user';

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  debug: false,
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        token.accessToken = account.access_token;
        // 获取并保存 jwtToken
        const jwtToken = await getJwtToken(account.access_token as string);
        if (jwtToken) {
          token.jwtToken = jwtToken;
        }
      }
      if (user) {
        token.uid = user.id;
        token.user = {
          ...user,
          id: user.id,
          // @ts-ignore
          role: user.role,
        };
      }

      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      if (token?.user && token?.user.id) {
        // @ts-ignore
        session.user.role = token.user.role;
        // @ts-ignore
        session.user.accessToken = token.accessToken;
        // @ts-ignore
        session.user.jwtToken = token.jwtToken;
      }

      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  events: {
    // signIn: async ({ user, isNewUser }) => {},
    // updateUser: async ({ user }) => {},
    // createUser: async ({ user }) => {},
  },
  providers: [
    {
      id: 'mixin',
      name: 'mixin',
      type: 'oauth',
      style: {
        logo: 'https://mixin.one/zh/img/favicon.png',
        bg: '#24292f',
        text: '#fff',
      },
      clientId: env.NEXT_PUBLIC_MIXIN_CLIENT_ID,
      clientSecret: env.MIXIN_CLIENT_SECRET,
      authorization: {
        url: 'https://mixin.one/oauth/authorize',
        params: {
          scope: 'PROFILE:READ ASSETS:READ SNAPSHOTS:READ',
          client_id: env.NEXT_PUBLIC_MIXIN_CLIENT_ID,
          response_type: 'code',
        },
      },
      token: {
        url: 'https://api.mixin.one/oauth/token',
        async request(context) {
          const response = await fetch('https://api.mixin.one/oauth/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              client_id: env.NEXT_PUBLIC_MIXIN_CLIENT_ID,
              client_secret: env.MIXIN_CLIENT_SECRET,
              code: context.params.code,
            }),
          }).then((resp) => resp.json());

          return {
            tokens: {
              access_token: response.access_token,
              scope: response.scope,
            },
          };
        },
      },
      userinfo: {
        request: async (context) => {
          const response = await fetch('https://api.mixin.one/me', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${context.tokens.access_token}`,
            },
          }).then((resp) => resp.json());

          return {
            ...response,
            token: context.tokens.access_token,
          };
        },
      },
      profile(profile: any) {
        return {
          id: profile?.data.user_id,
          name: profile?.data.full_name,
          email: profile?.data.email,
          image: profile?.data.avatar_url,
          role: profile.data.role ? profile.data.role : 'user',
        };
      },
    },
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
