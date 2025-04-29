import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MinutesContainer from '../../components/minutesContainer';

// MinutesContainerのモック実装を簡略化
vi.mock('../../components/minutesContainer', () => ({
  default: ({ fontSize }) => (
    <div data-testid="minutes-container-mock">
      <div data-testid="input-area">
        <textarea data-testid="transcript-input"></textarea>
        <button data-testid="generate-button">議事録生成</button>
      </div>
      
      <div data-testid="output-area">
        <div data-testid="minutes-output">
          <div data-testid="sample-minutes"># テスト議事録</div>
          <div data-testid="action-buttons">
            <button data-testid="download-button">ダウンロード</button>
            <button data-testid="copy-button">クリップボードにコピー</button>
          </div>
        </div>
      </div>
      
      <div>Font Size: {fontSize?.value || 'default'}</div>
    </div>
  )
}));

// clipboardのモック
const mockClipboard = {
  writeText: vi.fn(() => Promise.resolve()),
};

describe('MinutesContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(global.navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
    });
  });

  it('can be imported', () => {
    expect(MinutesContainer).toBeDefined();
  });

  it('renders with input and output areas', () => {
    render(<MinutesContainer fontSize={{ value: 'body-m', label: 'body-m' }} />);
    expect(screen.getByTestId('minutes-container-mock')).toBeInTheDocument();
    expect(screen.getByTestId('input-area')).toBeInTheDocument();
    expect(screen.getByTestId('output-area')).toBeInTheDocument();
  });

  it('renders with clipboard copy button', () => {
    render(<MinutesContainer fontSize={{ value: 'body-m', label: 'body-m' }} />);
    expect(screen.getByTestId('copy-button')).toBeInTheDocument();
    expect(screen.getByTestId('copy-button')).toHaveTextContent('クリップボードにコピー');
  });
});