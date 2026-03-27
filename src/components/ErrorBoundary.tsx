/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Box } from 'lucide-react';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("3D Viewer Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-white/40 p-6 text-center">
          <Box className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-xs font-medium uppercase tracking-widest">Lỗi kết nối mô hình 3D</p>
          <p className="text-[10px] mt-2 opacity-60">Không thể tải mô hình từ nguồn này (có thể do lỗi CORS hoặc link hỏng)</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase transition-colors"
          >
            Thử lại
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
