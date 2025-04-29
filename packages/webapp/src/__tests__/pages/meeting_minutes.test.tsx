import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MeetingMinutesPage from '../../pages/meeting_minutes/index';

// MinutesContainerコンポーネントのモック
vi.mock('../../components/minutesContainer', () => ({
  default: () => <div data-testid="minutes-container-mock">Minutes Container Mock</div>
}));

describe('MeetingMinutesPage', () => {
  it('renders the page with correct title', () => {
    render(<MeetingMinutesPage />);
    
    // ページタイトルの確認
    expect(screen.getByText('議事録生成')).toBeInTheDocument();
  });

  it('renders the font size selector', () => {
    render(<MeetingMinutesPage />);
    
    // フォントサイズセレクタの確認
    expect(screen.getByText('フォントサイズ')).toBeInTheDocument();
  });

  it('renders the MinutesContainer component', () => {
    render(<MeetingMinutesPage />);
    
    // MinutesContainerコンポーネントがレンダリングされていることを確認
    expect(screen.getByTestId('minutes-container-mock')).toBeInTheDocument();
  });
});