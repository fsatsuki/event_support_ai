import { describe, it, expect, vi, beforeEach } from 'vitest';

// E2Eテストのためのモック設定
describe('Clipboard Interaction E2E Tests', () => {
  // クリップボード機能のモック
  let clipboardData = '';
  const mockClipboard = {
    writeText: vi.fn((text) => {
      clipboardData = text;
      return Promise.resolve();
    }),
    readText: vi.fn(() => Promise.resolve(clipboardData)),
  };
  
  beforeEach(() => {
    // 各テスト前にクリップボードデータをリセット
    clipboardData = '';
    // グローバルオブジェクトにクリップボードを追加
    Object.defineProperty(global, 'navigator', {
      value: {
        ...global.navigator,
        clipboard: mockClipboard
      },
      writable: true,
      configurable: true
    });
    
    vi.clearAllMocks();
  });

  it('confirms clipboard API is available', async () => {
    // クリップボードAPIが使用可能であることを確認
    expect(navigator.clipboard).toBeDefined();
    expect(typeof navigator.clipboard.writeText).toBe('function');
    expect(typeof navigator.clipboard.readText).toBe('function');
  });

  it('verify clipboard write and read operations', async () => {
    const testText = '# サンプル議事録データ';
    
    // クリップボードに書き込み
    await navigator.clipboard.writeText(testText);
    
    // 書き込み関数が呼ばれたか確認
    expect(mockClipboard.writeText).toHaveBeenCalledWith(testText);
    expect(mockClipboard.writeText).toHaveBeenCalledTimes(1);
    
    // データが正しく保存されたか確認
    expect(clipboardData).toBe(testText);
    
    // クリップボードから読み取り
    const readResult = await navigator.clipboard.readText();
    expect(readResult).toBe(testText);
  });
});