import { describe, it, expect, vi } from 'vitest';
import MinutesContainer from '../../components/minutesContainer';

// シンプルにコンポーネントの存在のみをテスト
describe('MinutesContainer', () => {
  it('can be imported', () => {
    // コンポーネントがインポート可能であることを確認
    expect(MinutesContainer).toBeDefined();
  });
});