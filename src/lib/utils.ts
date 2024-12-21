import { PaymentParams } from '@mixin.dev/mixin-node-sdk/src/client/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { validate, v4 } from 'uuid';
import qs from 'qs';
import { toast, ToastOptions } from 'react-toastify';
import { useRef } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const buildMixinOneSafePaymentUri = (params: PaymentParams) => {
  let address = params.uuid;
  if (params.uuid && validate(params.uuid)) address = params.uuid;
  const baseUrl = `https://mixin.one/pay/${address}`;
  const p = {
    asset: params.asset,
    amount: params.amount,
    memo: params.memo,
    trace: params.trace ?? v4(),
    return_to: params.returnTo && encodeURIComponent(params.returnTo),
  };
  const query = qs.stringify(p);
  return `${baseUrl}?${query}`;
};

const defaultOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: { bottom: '100px' }, // 设置距离底部20px的距离
};

export const showToast = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, { ...defaultOptions, ...options }),
  error: (message: string, options?: ToastOptions) =>
    toast.error(message, { ...defaultOptions, ...options }),
  info: (message: string, options?: ToastOptions) =>
    toast.info(message, { ...defaultOptions, ...options }),
  warn: (message: string, options?: ToastOptions) =>
    toast.warn(message, { ...defaultOptions, ...options }),
};

export function formatNumber(input: string, fixed: number = 2): string {
  const numberValue = parseFloat(input);

  // 检查是否成功转换为数字
  if (isNaN(numberValue)) {
    return '0';
  }

  // 定义单位和阈值
  const units = [
    { value: 1_000_000, symbol: 'm' },
    { value: 1_000, symbol: 'k' },
  ];

  // 根据大小选择单位
  for (const { value, symbol } of units) {
    if (numberValue >= value) {
      const formattedValue = (numberValue / value).toFixed(fixed);
      return `${formattedValue} ${symbol}`;
    }
  }

  return numberValue.toFixed(fixed);
}

export function convertToPercentage(
  input: string,
  toFixed: number = 0,
): string {
  const numberValue = parseFloat(input);

  if (isNaN(numberValue)) {
    return 'Invalid input';
  }

  const percentageValue = (numberValue * 100).toFixed(toFixed); // 保留整数部分
  return `${percentageValue}%`;
}

export type ActionStr = 'lend' | 'borrow';

export function strToAction(input: ActionStr): number {
  switch (input) {
    case 'lend':
      return 1;
    case 'borrow':
      return 2;
    default:
      return 0;
  }
}

export function decimalStrToNumber(input: string): number {
  return parseFloat(input);
}

export function getInitHealthColor(health: number): string {
  if (health >= 0.5) {
    return '#75BA80'; // green color " : "#",
  } else if (health >= 0.25) {
    return '#b8b45f'; // yellow color
  } else {
    return '#CF6F6F'; // red color
  }
}

export function getMaintHealthColor(health: number): string {
  if (health >= 0.5) {
    return '#75BA80'; // green color " : "#",
  } else if (health >= 0.25) {
    return '#b8b45f'; // yellow color
  } else {
    return '#CF6F6F'; // red color
  }
}

export function getLiquidationPriceColor(
  currentPrice: number,
  liquidationPrice: number,
): string {
  const safety = liquidationPrice / currentPrice;
  let color: string;
  if (safety >= 0.5) {
    color = '#75BA80';
  } else if (safety >= 0.25) {
    color = '#B8B45F';
  } else {
    color = '#CF6F6F';
  }
  return color;
}
