import { User } from 'next-auth';
import { create } from 'zustand';

type ZoomLevel = 1 | 2 | 3;

interface UserProfileState {
  // State
  lendZoomLevel: ZoomLevel;
  denominationUSD: boolean;
  showBadges: boolean;
  currentUser: User | null;
  hasUser: boolean | null;

  // Actions
  setLendZoomLevel: (level: ZoomLevel) => void;
  setDenominationUSD: (checked: boolean) => void;
  setShowBadges: (checked: boolean) => void;
  //   checkForFirebaseUser: (walletAddress: string) => Promise<void>;
  //   setFirebaseUser: (user: User | null) => void;
  //   signoutFirebaseUser: (
  //     isConnected: boolean,
  //     walletAddress?: string,
  //   ) => Promise<void>;
  //   fetchPoints: (walletAddress: string) => Promise<void>;
  //   resetPoints: () => void;
}
function createUserProfileStore() {
  return create<UserProfileState>()((set, get) => ({
    // State
    lendZoomLevel: 3,
    denominationUSD: false,
    showBadges: false,
    currentUser: null,
    hasUser: null,

    // Actions
    setLendZoomLevel: (level: ZoomLevel) =>
      set(() => ({ lendZoomLevel: level })),
    setDenominationUSD: (checked: boolean) =>
      set(() => ({ denominationUSD: checked })),
    setShowBadges: (checked: boolean) => set(() => ({ showBadges: checked })),
  }));
}

export { createUserProfileStore };
export type { ZoomLevel, UserProfileState };
