import {
  Prompter,
  SummarizeParams,
} from './index';

export const claudePrompter: Prompter = {  
  summarizePrompt(params: SummarizeParams): string {
    return `あなたは日英同時通訳の支援をするエージェントです。
現在進行中のイベントのスピーチの履歴が与えられます。履歴は下に行くほど新しいです。
直近のスピーチの内容を詳細に説明してください。

日本語で回答してください。

<スピーチの履歴>
${params.sentence}
</スピーチの履歴>

親切な挨拶や返答は不要です。


\n\nAssistant: 
`;
  },

  generateMinutes(params: SummarizeParams): string {
    return `あなたは議事録作成の専門家です。
与えられた文字起こしデータから、詳細で構造化された議事録を作成してください。

以下の点に注意して議事録を作成してください：
1. 議題や主要なトピックを明確にして見出しとして含める
2. 議論の重要なポイントを箇条書きでまとめる
3. 決定事項や次のアクションアイテムを明確にする
4. 参加者の発言や意見を適切に要約する
5. 議事録は公式文書として適切な形式と言葉遣いを使用する

日本語で回答してください。

<文字起こしデータ>
${params.sentence}
</文字起こしデータ>

親切な挨拶や返答は不要です。議事録の内容のみを提供してください。


\n\nAssistant: 
`;
  }

};
