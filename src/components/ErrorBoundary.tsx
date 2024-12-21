'use client';

import React, { ErrorInfo, ReactNode } from 'react';
import { handleError } from '@/lib/errorHandler';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    handleError(error);
  }

  render() {
    if (this.state.hasError) {
      return null; // 或者返回一个简单的错误提示组件
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
