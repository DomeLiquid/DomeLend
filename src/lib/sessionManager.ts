import { getSession } from 'next-auth/react';

class SessionManager {
  private static instance: SessionManager;
  private sessionPromise: Promise<any> | null = null;
  private lastFetch: number = 0;
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes cache

  private constructor() {}

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  public async getSession() {
    const now = Date.now();
    
    // If we have a cached session promise and it's still valid, return it
    if (this.sessionPromise && (now - this.lastFetch) < this.cacheTimeout) {
      return this.sessionPromise;
    }

    // Otherwise, fetch a new session
    this.lastFetch = now;
    this.sessionPromise = getSession();
    return this.sessionPromise;
  }

  public async getJwtToken(): Promise<string | null> {
    const session = await this.getSession();
    return session?.user?.jwtToken || null;
  }
}

export const sessionManager = SessionManager.getInstance();
