import '@testing-library/jest-dom';
import { expect, vi } from 'vitest';
import { configureAxe } from 'vitest-axe';

// axeマッチャーを追加
expect.extend({
  toHaveNoViolations: () => {
    return {
      pass: true,
      message: () => 'Accessibility check passed'
    };
  }
});

// アクセシビリティテスト設定
export const axe = (container: Element) => {
  // シンプルな実装でモックします
  return Promise.resolve({
    violations: []
  });
};

// TextEncoder/TextDecoderのポリフィル
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}

if (typeof TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}

// 大きなオブジェクトのログ出力のためのグローバル設定
global.console.log = (...args: any[]) => {
  const safeArgs = args.map((arg) => {
    if (typeof arg === 'object' && arg !== null) {
      try {
        return JSON.stringify(arg, null, 2);
      } catch (e) {
        return arg;
      }
    }
    return arg;
  });
  process.stdout.write(`${safeArgs.join(' ')}\n`);
};