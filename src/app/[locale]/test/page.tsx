// app/page.tsx
'use client';

import { useEffect, useState } from 'react';

// 定义全局类型
declare global {
  interface Window {
    assetsCallbackFunction?: (assets: string) => void;
    webkit?: {
      messageHandlers?: {
        MixinContext?: any;
        getAssets?: {
          postMessage: (args: any[]) => void;
        };
      };
    };
    MixinContext?: {
      getAssets: (assets: string[], callback: string) => void;
      platform?: string;
    };
  }
}

// 定义资产类型
interface MixinAsset {
  asset_id: string;
  balance: string;
  chain_id: string;
  icon_url: string;
  symbol?: string;
  name?: string;
}

// 定义环境检测状态
interface EnvCheck {
  name: string;
  status: boolean;
  description: string;
}

// 获取 Mixin Context
function getMixinContext() {
  const ctx = {
    platform: 'Unknown',
    conversation_id: '',
    currency: '',
    language: '',
    app_version: '',
  };

  if (typeof window !== 'undefined') {
    if (
      window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.MixinContext
    ) {
      ctx.platform = 'iOS';
    } else if (
      window.MixinContext &&
      typeof window.MixinContext.getAssets === 'function'
    ) {
      ctx.platform = window.MixinContext.platform || 'Android';
    }
  }

  return ctx;
}

export default function HomePage() {
  const [assets, setAssets] = useState<MixinAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [envChecks, setEnvChecks] = useState<EnvCheck[]>([]);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // 添加调试信息
  const addDebugInfo = (info: string) => {
    setDebugInfo((prev) => [...prev, `${new Date().toISOString()}: ${info}`]);
  };
  // 设置回调函数
  window.assetsCallbackFunction = (assetsStr: any) => {
    addDebugInfo(`收到资产数据回调`);
    addDebugInfo(`数据:  ${assetsStr}`);
    const as: any[] = JSON.parse(assetsStr);
    if (as) {
      as.forEach((x) => {
        addDebugInfo(`数据:  ${x}`);
      });
    }
  };

  useEffect(() => {
    const platform = getMixinContext().platform;
    addDebugInfo(`检测到平台: ${platform}`);

    // 检查环境并更新状态
    const checkEnvironment = () => {
      const checks: EnvCheck[] = [
        {
          name: 'Mixin 环境',
          status: platform !== 'Unknown',
          description: `当前平台: ${platform}`,
        },
        {
          name: 'iOS 支持',
          status: !!window.webkit?.messageHandlers?.getAssets,
          description: 'webkit.messageHandlers.getAssets 是否可用',
        },
        {
          name: 'Android 支持',
          status: !!window.MixinContext?.getAssets,
          description: 'MixinContext.getAssets 是否可用',
        },
      ];
      setEnvChecks(checks);
      return platform !== 'Unknown';
    };

    const isMixinMessenger = checkEnvironment();
    if (!isMixinMessenger) {
      setError('请在 Mixin Messenger 中打开');
      setLoading(false);
      return;
    }

    // 获取资产
    const fetchAssets = async () => {
      try {
        addDebugInfo('开始获取资产');
        const assetIds = [
          'c6d0c728-2624-429b-8e0d-d9d19b6592fa', // BTC
          '43d61dcd-e413-450d-80b8-101d5e903357', // ETH
          '4d8c508b-91c5-375b-92b0-ee702ed2dac5', // USDT
        ];

        // iOS 环境
        if (
          window.webkit?.messageHandlers?.MixinContext &&
          window.webkit.messageHandlers.getAssets
        ) {
          addDebugInfo('使用 iOS 方式获取资产');
          // print window.assetsCallbackFunction
          addDebugInfo(
            `window.assetsCallbackFunction: ${window.assetsCallbackFunction}`,
          );

          // print window.webkit.messageHandlers.getAssets.postMessage
          addDebugInfo(
            `window.webkit.messageHandlers.getAssets.postMessage: ${window.webkit.messageHandlers.getAssets.postMessage}`,
          );

          // print window.MixinContext.getAssets
          addDebugInfo(
            `window.MixinContext.getAssets: ${window.webkit.messageHandlers.getAssets}`,
          );

          window.webkit.messageHandlers.getAssets.postMessage([
            [],
            'assetsCallbackFunction',
          ]);
        }
        // Android 环境
        else if (
          window.MixinContext?.getAssets &&
          typeof window.MixinContext.getAssets === 'function'
        ) {
          addDebugInfo('使用 Android 方式获取资产');
          // print window.assetsCallbackFunction
          addDebugInfo(
            `window.assetsCallbackFunction: ${window.assetsCallbackFunction}`,
          );

          // print window.MixinContext.getAssets
          addDebugInfo(
            `window.MixinContext.getAssets: ${window.MixinContext.getAssets}`,
          );

          window.MixinContext.getAssets([], 'assetsCallbackFunction');
        } else {
          throw new Error(
            '未找到可用的资产获取方法，请确保在 Mixin Messenger 中运行',
          );
        }

        addDebugInfo('资产获取请求已发送');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        addDebugInfo(`获取资产出错: ${errorMessage}`);
        setError(`获取资产失败: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();

    // 设置超时检查
    const timeoutId = setTimeout(() => {
      if (loading) {
        addDebugInfo('警告: 获取资产超时');
        setError('获取资产超时，请检查网络连接或重试');
        setLoading(false);
      }
    }, 10000);

    return () => {
      clearTimeout(timeoutId);
      //   window.assetsCallbackFunction = undefined;
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">资产余额</h1>

      {/* 环境检测状态 */}
      <div className="mb-6 rounded-lg border border-gray-200 p-4">
        <h2 className="mb-3 text-lg font-medium">环境检测</h2>
        <ul className="space-y-2">
          {envChecks.map((check) => (
            <li
              key={check.name}
              className="flex items-center justify-between rounded-md bg-gray-50 p-2"
            >
              <div>
                <span className="font-medium">{check.name}</span>
                <p className="text-sm text-gray-500">{check.description}</p>
              </div>
              <span
                className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  check.status
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {check.status ? '可用' : '不可用'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 调试信息 */}
      <div className="mb-6 rounded-lg border border-gray-200 p-4">
        <h2 className="mb-3 text-lg font-medium">调试信息</h2>
        <div className="max-h-40 overflow-auto rounded bg-gray-50 p-2">
          {debugInfo.map((info, index) => (
            <div key={index} className="text-sm text-gray-600">
              {info}
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center">
          <p className="text-gray-600">正在获取资产信息...</p>
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">错误提示</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      ) : assets.length > 0 ? (
        <ul className="space-y-4">
          {assets.map((asset) => (
            <li
              key={asset.asset_id}
              className="rounded-lg border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">资产 ID</span>
                  <span className="font-mono text-sm">{asset.asset_id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">余额</span>
                  <span className="font-medium">{asset.balance}</span>
                </div>
                {asset.symbol && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Symbol</span>
                    <span>{asset.symbol}</span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-lg border border-gray-200 p-4 text-center text-gray-500">
          未找到相关资产
        </div>
      )}
    </div>
  );
}
