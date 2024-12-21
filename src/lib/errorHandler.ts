import { showToast } from './utils';

export function handleError(error: unknown) {
  console.error('An error occurred:', error);

  let message = 'An unexpected error occurred';
  if (error instanceof Error) {
    message = error.message;
  }
  showToast.error(message.charAt(0).toUpperCase() + message.slice(1));
}

// 用于包装异步函数的辅助函数
export function withErrorHandling<T>(
  fn: () => Promise<T>,
): () => Promise<T | void> {
  return async () => {
    try {
      return await fn();
    } catch (error) {
      handleError(error);
    }
  };
}
