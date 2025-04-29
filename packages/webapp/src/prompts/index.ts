import { claudePrompter } from './claude';

export const getPrompter = (modelId?: string) => {
  // modelIdが未定義の場合でもデフォルトでclaudePrompterを返す
  if (!modelId || modelId.startsWith('anthropic.claude-')) {
    return claudePrompter;
  }
  return claudePrompter;
};

export type SummarizeParams = {
  sentence: string;
  context?: string;
};


export interface Prompter {
  summarizePrompt(params: SummarizeParams): string;
  generateMinutes(params: SummarizeParams): string;
}
