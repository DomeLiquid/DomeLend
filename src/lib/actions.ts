import {
  Account,
  AccountPositions,
  Balance,
  Bank,
  CalCollateralResponse,
  CheckPaymentResultResponse,
  GetPaymentInfoResponse,
  ListBanksResponseItem,
  DomeFiResponse,
  Payment,
  Asset,
  AssetWithPrice,
  BankWithState,
  ListBalanceResponseItem,
  CreatePaymentRequest,
  UserAssetAmount,
} from '@/types/account';
import { env } from '@/env.mjs';
import { handleError } from '@/lib/errorHandler';
import { AccountSummary, ActionType } from './mrgnlend';
import {
  ActionPreview,
  SimulatedActionPreview,
} from '@/components/action-box/actions/lend-box/utils/lend-simulation.utils';
import { sessionManager } from './sessionManager';
import { PointsInfo, UserPointsData } from './points';

export async function newAccount() {
  try {
    const session = await sessionManager.getSession();
    if (!session?.user?.jwtToken) {
      throw new Error('Unauthorized: Missing access token');
    }

    const response = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_URL}/group/${env.NEXT_PUBLIC_GROUP_ID}/account`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.user.jwtToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: DomeFiResponse<Account> | Account = await response.json();
    if (data && 'code' in data) {
      throw new Error(
        (data as DomeFiResponse<Account>).message || 'unknown error',
      );
    }
    return data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function actionPreview(
  accountId: string,
  bankId: string,
  amount: string,
  actionMode: ActionType,
): Promise<ActionPreview | null> {
  try {
    const jwtToken = await sessionManager.getJwtToken();
    if (!jwtToken) {
      throw new Error('Unauthorized: Missing access token');
    }

    const response = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_URL}/dome/account/${accountId}/action-preview`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bankId, amount, actionMode }),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(`${data.message}`);
    }

    const data: ActionPreview = await response.json();
    return data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

// export async function simulatePreview(
//   accountId: string,
//   bankId: string,
//   amount: string,
//   actionMode: ActionType,
// ): Promise<SimulatedActionPreview | null> {
//   try {
//     const jwtToken = await sessionManager.getJwtToken();
//     if (!jwtToken) {
//       throw new Error('Unauthorized: Missing access token');
//     }

//     const response = await fetch(
//       `${env.NEXT_PUBLIC_BACKEND_URL}/account/${accountId}/simulate`,
//       {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${jwtToken}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ bankId, amount, actionMode }),
//       },
//     );

//     if (!response.ok) {
//       const data = await response.json();
//       throw new Error(`${data.message}`);
//     }

//     const data: SimulatedActionPreview = await response.json();
//     return data;
//   } catch (error) {
//     handleError(error);
//     return null;
//   }
// }

export async function getUserAssetsInfo(
  assetIds: string[],
): Promise<UserAssetAmount[] | null> {
  try {
    const jwtToken = await sessionManager.getJwtToken();
    if (!jwtToken) {
      return null;
    }

    const response = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_URL}/user/asset-amount`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assetIds),
      },
    );
    const data: UserAssetAmount[] = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

export async function accountSummary(
  accountId: string,
): Promise<AccountSummary | null> {
  try {
    const session = await sessionManager.getSession();
    if (!session?.user?.jwtToken) {
      throw new Error('Unauthorized: Missing access token');
    }

    const response = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_URL}/account/${accountId}/summary`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.user.jwtToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(`${data.message}`);
    }

    const data: AccountSummary = await response.json();
    return data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function listBalances(
  accountId: string,
): Promise<ListBalanceResponseItem[] | null> {
  try {
    const session = await sessionManager.getSession();
    if (!session?.user?.jwtToken) {
      throw new Error('Unauthorized: Missing access token');
    }

    const response = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_URL}/account/${accountId}/balances`,
      {
        headers: {
          Authorization: `Bearer ${session.user.jwtToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    const data: any = await response.json();

    if (!response.ok) {
      throw new Error(`${data.message}`);
    }

    return data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function listBanks(
  groupId: string = env.NEXT_PUBLIC_GROUP_ID,
): Promise<BankWithState[] | null> {
  try {
    const response = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_URL}/group/${groupId}/banks`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`${data.message}`);
    }

    return data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function getGroupAssetsWithPrice(
  groupId: string = env.NEXT_PUBLIC_GROUP_ID,
): Promise<AssetWithPrice[] | null> {
  try {
    const response = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_URL}/group/${groupId}/assets`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const data: any = await response.json();

    if (!response.ok) {
      throw new Error(`${data.message}`);
    }

    return data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function getAccounts(): Promise<Account[] | null> {
  try {
    const session = await sessionManager.getSession();
    if (!session?.user?.jwtToken) {
      return null;
    }

    const response = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_URL}/group/${env.NEXT_PUBLIC_GROUP_ID}/accounts`,
      {
        headers: {
          Authorization: `Bearer ${session.user.jwtToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Account[] = await response.json();
    return data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function createPayment({
  bankId,
  accountId,
  amount,
  action,
  meta,
}: CreatePaymentRequest): Promise<string | null> {
  try {
    const session = await sessionManager.getSession();
    if (!session?.user?.jwtToken) {
      throw new Error('Unauthorized: Missing access token');
    }

    const response = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/payment`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.user.jwtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bankId,
        accountId,
        amount,
        action,
        meta,
      }),
    });

    const data: any = await response.json();

    if (!response.ok) {
      throw new Error(`${data.message}`);
    }

    return data.requestId;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function checkPaymentResult(
  requestId: string,
): Promise<CheckPaymentResultResponse | null> {
  try {
    const session = await sessionManager.getSession();
    if (!session?.user?.jwtToken) {
      throw new Error('Unauthorized: Missing access token');
    }

    const response = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_URL}/payment?requestId=${requestId}`,
      {
        headers: {
          Authorization: `Bearer ${session.user.jwtToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const data: any = await response.json();

    if (!response.ok) {
      throw new Error(`${data.message}`);
    }

    return data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function getPaymentInfo(
  id: string,
): Promise<GetPaymentInfoResponse | null> {
  try {
    const session = await sessionManager.getSession();
    if (!session?.user?.jwtToken) {
      throw new Error('Unauthorized: Missing access token');
    }

    const response = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_URL}/payment/${id}`,
      {
        headers: {
          Authorization: `Bearer ${session.user.jwtToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const data: any = await response.json();

    if (!response.ok) {
      throw new Error(`${data.message}`);
    }

    return data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function getPointsInfos(): Promise<PointsInfo[]> {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/points-info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(`${data.message}`);
    }

    const data: PointsInfo[] = await response.json();
    return data;
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function getPointsDataForUser(): Promise<UserPointsData> {
  try {
    const jwtToken = await sessionManager.getJwtToken();
    if (!jwtToken) {
      return {
        owner: '',
        depositPoints: 0,
        borrowPoints: 0,
        referralPoints: 0,
        userRank: null,
        totalPoints: 0,
      };
    }

    const response = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/user-points`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch points data');
    }

    const data: UserPointsData = await response.json(); // Assuming the response is in JSON format
    return data;
  } catch (error) {
    handleError(error);
    return {
      owner: '',
      depositPoints: 0,
      borrowPoints: 0,
      referralPoints: 0,
      userRank: null,
      totalPoints: 0,
    };
  }
}

export async function getJwtToken(accessToken: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_URL}/user/connect`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ accessToken }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch JWT token');
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    handleError(error);
    return null;
  }
}
