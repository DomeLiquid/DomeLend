import { ExtendedBankInfo } from '@/lib/mrgnlend';
import { useRef, useMemo } from 'react';

export const useSortedBanks = (banks: ExtendedBankInfo[]) => {
  // 使用 ref 存储初始排序顺序
  const initialOrderRef = useRef<Map<string, number>>();
  
  // 如果还没有初始顺序，创建一个
  if (!initialOrderRef.current && banks.length > 0) {
    initialOrderRef.current = new Map(
      banks.map((bank, index) => [bank.bankId, index])
    );
  }

  // 使用 useMemo 缓存排序后的结果
  const sortedBanks = useMemo(() => {
    if (!initialOrderRef.current || banks.length === 0) {
      return banks;
    }

    // 创建银行列表的副本并按照初始顺序排序
    return [...banks].sort((a, b) => {
      const orderA = initialOrderRef.current!.get(a.bankId) ?? Number.MAX_VALUE;
      const orderB = initialOrderRef.current!.get(b.bankId) ?? Number.MAX_VALUE;
      return orderA - orderB;
    });
  }, [banks]);

  return sortedBanks;
};
