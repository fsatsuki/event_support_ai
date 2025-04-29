// Mock for useBedrock hook
export const mockInvokeBedrock = vi.fn().mockImplementation(async (body: string) => {
  // シミュレートされたストリームレスポンス
  const mockChunk = new TextEncoder().encode(JSON.stringify({
    completion: '# テスト議事録\n\n## 議題\n- 項目1\n- 項目2\n\n## 決定事項\n1. 決定事項1\n2. 決定事項2'
  }));

  // ReadableStreamのモック作成
  const stream = {
    async *[Symbol.asyncIterator]() {
      yield { chunk: { bytes: mockChunk } };
    }
  };

  return {
    body: stream
  };
});

export const mockUseBedrock = () => {
  return {
    invokeBedrock: mockInvokeBedrock
  };
};

export default mockUseBedrock;