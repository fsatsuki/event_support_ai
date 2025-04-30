// Amazon Bedrock API の型定義

// 会話の役割（ユーザーかアシスタント）
export type ConversationRole = 'user' | 'assistant';

// メッセージのコンテンツブロックの型
export interface ContentBlock {
  text: string;
}

// メッセージの型
export interface Message {
  role: ConversationRole;
  content: ContentBlock[];
}

// 推論設定の型
export interface InferenceConfig {
  maxTokens: number;
  temperature: number;
  topP: number;
  stopSequences: string[];
}

// Converseコマンドの入力パラメータ
export interface ConverseCommandParams {
  modelId: string;
  messages: Message[];
  inferenceConfig: InferenceConfig;
}
