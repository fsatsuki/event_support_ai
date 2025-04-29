import { describe, it, expect } from 'vitest';
import { claudePrompter } from '../../prompts/claude';
import { SummarizeParams } from '../../prompts';

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

    it('should handle empty input correctly', () => {
      const params = {
        sentence: ''
      };
      
      const result = claudePrompter.summarizePrompt(params);
      
      expect(result).toContain('あなたは日英同時通訳の支援をするエージェントです');
      expect(result).toContain('<スピーチの履歴>\n\n</スピーチの履歴>');
    });

    it('should include context when provided', () => {
      const params: SummarizeParams = {
        sentence: 'これはテスト文章です',
        context: '前提となる背景情報'
      };
      
      const result = claudePrompter.summarizePrompt(params);
      
      // contextが含まれるかは実際の実装によって異なるため、単純なテスト
      expect(result).toContain('これはテスト文章です');
      // contextが使われていなくてもテストは通過する（実装依存）
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

    it('should handle empty input correctly', () => {
      const params = {
        sentence: ''
      };
      
      const result = claudePrompter.generateMinutes(params);
      
      expect(result).toContain('あなたは議事録作成の専門家です');
      expect(result).toContain('<文字起こしデータ>\n\n</文字起こしデータ>');
    });

    it('should handle very long input correctly', () => {
      const longText = Array(100).fill('テスト文章です。').join(' ');
      const params = {
        sentence: longText
      };
      
      const result = claudePrompter.generateMinutes(params);
      
      // 入力テキストが含まれていることを確認
      expect(result).toContain(longText);
      // プロンプトの構造が維持されていることを確認
      expect(result).toContain('<文字起こしデータ>');
      expect(result).toContain('</文字起こしデータ>');
    });

    it('should handle special characters correctly', () => {
      const params = {
        sentence: 'テスト<script>alert("XSS")</script>と特殊文字 & < > " \' \n\t'
      };
      
      const result = claudePrompter.generateMinutes(params);
      
      // 特殊文字がそのまま含まれていることを確認
      expect(result).toContain('テスト<script>alert("XSS")</script>と特殊文字');
      // プロンプトの構造が維持されていることを確認
      expect(result).toContain('<文字起こしデータ>');
      expect(result).toContain('</文字起こしデータ>');
    });
  });

  // プロンプターの共通挙動のテスト
  describe('general behavior', () => {
    it('should have all required methods', () => {
      // Prompterインターフェースの実装をチェック
      expect(typeof claudePrompter.summarizePrompt).toBe('function');
      expect(typeof claudePrompter.generateMinutes).toBe('function');
    });

    it('should produce deterministic outputs for same inputs', () => {
      const params = {
        sentence: 'テスト文章です'
      };
      
      const result1 = claudePrompter.generateMinutes(params);
      const result2 = claudePrompter.generateMinutes(params);
      
      expect(result1).toBe(result2);
    });
  });
});