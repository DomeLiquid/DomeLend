import { UserAssetAmount } from '@/types/account';
import { getMixinContext } from '../app/utils/mixin';
import { getUserAssetsInfo } from './actions';

export interface MixinAsset {
  asset_id: string;
  balance: string;
  chain_id: string;
  icon_url: string;
  symbol?: string;
  name?: string;
  amount?: string;
  assetId?: string; // Compatible with existing API response
}

// Promise wrapper for getting assets
function createAssetsPromise(): Promise<MixinAsset[]> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Asset retrieval timeout'));
    }, 10000);

    // Define callback function
    window.assetsCallbackFunction = (assetsStr: string) => {
      clearTimeout(timeoutId);
      try {
        const assets = JSON.parse(assetsStr);
        resolve(assets);
      } catch (error) {
        reject(new Error('Failed to parse asset data'));
      }
    };
  });
}

// Get asset information
export async function getAssetsInfo(
  assetIds: string[],
): Promise<UserAssetAmount[] | null> {
  const platform = getMixinContext().platform;

  // If not in Mixin Messenger environment
  if (platform === 'Unknown') {
    return getUserAssetsInfo(assetIds);
  }

  try {
    const assetsPromise = createAssetsPromise();

    // iOS environment
    if (
      window.webkit?.messageHandlers?.MixinContext &&
      window.webkit.messageHandlers.getAssets
    ) {
      window.webkit.messageHandlers.getAssets.postMessage([
        [],
        'assetsCallbackFunction',
      ]);
    }
    // Android environment
    else if (
      window.MixinContext?.getAssets &&
      typeof window.MixinContext.getAssets === 'function'
    ) {
      window.MixinContext.getAssets([], 'assetsCallbackFunction');
    } else {
      throw new Error('No available method to get assets');
    }

    const assets = await assetsPromise;
    return assets.map(
      (asset) =>
        ({
          assetId: asset.asset_id,
          amount: parseFloat(asset.balance || '0'),
        }) as UserAssetAmount,
    );
  } catch (error) {
    console.error('Failed to get assets:', error);
    // Fallback to API method if Mixin Messenger method fails
    return getUserAssetsInfo(assetIds);
  }
}
