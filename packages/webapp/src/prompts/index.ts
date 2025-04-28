import { claudePrompter } from './claude';

export const getPrompter = (modelId: string) => {
  if (modelId.startsWith('anthropic.claude-')) {
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
