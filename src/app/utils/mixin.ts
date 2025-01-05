interface MixinContext {
  platform: string;
  conversation_id: string;
  currency: string;
  language: string;
  app_version: string;
}

// 获取 Mixin Context
export function getMixinContext(): MixinContext {
  const ctx: MixinContext = {
    platform: 'Unknown',
    conversation_id: '',
    currency: '',
    language: '',
    app_version: '',
  };

  if (typeof window === 'undefined') {
    return ctx;
  }

  // 检测 iOS 环境
  if (window.webkit?.messageHandlers?.MixinContext) {
    ctx.platform = 'iOS';
    return ctx;
  }

  // 检测 Android/Desktop 环境
  if (window.MixinContext) {
    // 优先使用平台自带的platform信息
    ctx.platform = window.MixinContext.platform || 'Android';
    return ctx;
  }

  return ctx;
}

// 检查是否在 Mixin Messenger 环境中
export function isMixinMessenger(): boolean {
  return getMixinContext().platform !== 'Unknown';
}

// 检查是否在 iOS 环境中
export function isIOS(): boolean {
  return getMixinContext().platform === 'iOS';
}

// 检查是否在 Android 环境中
export function isAndroid(): boolean {
  return getMixinContext().platform === 'Android';
}
