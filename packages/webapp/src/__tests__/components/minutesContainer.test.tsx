import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MinutesContainer from '../../components/minutesContainer';

// モックの設定
vi.mock('../../hooks/useBedrock', () => {
  return {
    default: () => ({
      invokeBedrock: async () => {
        const mockChunk = new TextEncoder().encode(JSON.stringify({
          completion: '# テスト議事録\n\n## 議題\n- 項目1\n- 項目2'
        }));

        const stream = {
          async *[Symbol.asyncIterator]() {
            yield { chunk: { bytes: mockChunk } };
          }
        };

        return {
          body: stream
        };
      }
    })
  };
});

// 環境変数のモック
vi.mock('../../prompts', () => {
  return {
    getPrompter: () => ({
      generateMinutes: () => 'テスト用プロンプト'
    })
  };
});

describe('MinutesContainer', () => {
  const mockFontSize = { value: 'body-m', label: 'body-m' };

  beforeEach(() => {
    // テスト前にモックをリセット
    vi.clearAllMocks();
    // TextEncoderとTextDecoderが存在しない場合は定義
    if (typeof TextEncoder === 'undefined') {
      global.TextEncoder = require('util').TextEncoder;
    }
    if (typeof TextDecoder === 'undefined') {
      global.TextDecoder = require('util').TextDecoder;
    }
  });

  it('renders correctly with initial state', () => {
    render(<MinutesContainer fontSize={mockFontSize} />);
    
    // 初期状態の確認
    expect(screen.getByText('文字起こしデータ入力')).toBeInTheDocument();
    expect(screen.getByText('文字起こしデータを入力してください')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '議事録生成' })).toBeInTheDocument();
    expect(screen.getByText('議事録が生成されるとここに表示されます')).toBeInTheDocument();
  });

  it('allows text input in the textarea', async () => {
    render(<MinutesContainer fontSize={mockFontSize} />);
    
    // テキストエリアに入力
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'これはテストの文字起こしデータです。' } });
    
    expect(textarea).toHaveValue('これはテストの文字起こしデータです。');
  });

  it('generates minutes when button is clicked', async () => {
    render(<MinutesContainer fontSize={mockFontSize} />);
    
    // テキストエリアに入力
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'これはテストの文字起こしデータです。' } });
    
    // ボタンをクリック
    const button = screen.getByRole('button', { name: '議事録生成' });
    fireEvent.click(button);
    
    // 結果が表示されるのを待つ
    await waitFor(() => {
      expect(screen.getByText('# テスト議事録')).toBeInTheDocument();
    });
    
    // 議事録の内容が表示されていることを確認
    expect(screen.getByText('## 議題')).toBeInTheDocument();
    expect(screen.getByText('- 項目1')).toBeInTheDocument();
    expect(screen.getByText('- 項目2')).toBeInTheDocument();
    
    // エクスポートボタンが表示されていることを確認
    expect(screen.getByRole('button', { name: '議事録をエクスポート' })).toBeInTheDocument();
  });
});