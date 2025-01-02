export interface UserPointsData {
  owner: string;
  depositPoints: number;
  borrowPoints: number;
  referralPoints: number;
  userRank: number | null;
  totalPoints: number;
}

export interface PointsInfo {
  full_name: string;
  depositPoints: number;
  borrowPoints: number;
  referralPoints: number;
}

export const DEFAULT_USER_POINTS_DATA: UserPointsData = {
  owner: '',
  depositPoints: 0,
  borrowPoints: 0,
  referralPoints: 0,
  userRank: null,
  totalPoints: 0,
};
