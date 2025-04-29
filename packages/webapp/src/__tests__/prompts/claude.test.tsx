import { describe, it, expect } from 'vitest';
import { claudePrompter } from '../../prompts/claude';

describe('Claude Prompter', () => {
  describe('summarizePrompt', () => {
    it('should format the sentence correctly for summarization', () => {
      const params = {
        sentence: 'これはテストの文章です'
      };
      
      const result = claudePrompter.summarizePrompt(params);
      
      expect(result).toContain('あなたは日英同時通訳の支援をするエージェントです');
      expect(result).toContain('<スピーチの履歴>');
      expect(result).toContain(params.sentence);
      expect(result).toContain('</スピーチの履歴>');
    });
  });
  
  describe('generateMinutes', () => {
    it('should format the sentence correctly for minutes generation', () => {
      const params = {
        sentence: 'これは議事録のためのテスト文章です'
      };
      
      const result = claudePrompter.generateMinutes(params);
      
      expect(result).toContain('あなたは議事録作成の専門家です');
      expect(result).toContain('<文字起こしデータ>');
      expect(result).toContain(params.sentence);
      expect(result).toContain('</文字起こしデータ>');
      expect(result).toContain('議題や主要なトピック');
      expect(result).toContain('議論の重要なポイント');
      expect(result).toContain('決定事項や次のアクションアイテム');
    });
  });
});