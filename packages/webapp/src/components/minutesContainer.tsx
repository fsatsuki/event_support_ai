import { useState } from 'react';
import {
  Box,
  BoxProps,
  Button,
  Container,
  FormField,
  Header,
  SpaceBetween,
  SelectProps,
  Textarea,
  Flashbar,
  FlashbarProps,
} from '@cloudscape-design/components';

import useBedrock from '../hooks/useBedrock';
import { getPrompter } from '../prompts';

interface Props {
  fontSize: SelectProps.Option;
}

const modelId = import.meta.env.VITE_APP_MODEL_ID;

const MinutesContainer: React.FC<Props> = (props) => {
  const { invokeBedrock } = useBedrock();
  const [transcriptText, setTranscriptText] = useState<string>('');
  const [minutesText, setMinutesText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<FlashbarProps.MessageDefinition[]>([]);

  const prompter = getPrompter(modelId);

  const handleTranscriptChange = (value: string) => {
    setTranscriptText(value);
  };

  const generateMinutes = async () => {
    if (!transcriptText.trim()) {
      return;
    }

    setIsGenerating(true);
    setNotifications([]);

    // プロンプト生成
    const prompt = prompter.generateMinutes({
      sentence: transcriptText,
    });

    const payload = {
      max_tokens_to_sample: 4000,
      temperature: 0.7,
      top_k: 250,
      top_p: 0.999,
      stop_sequences: ["\n\nHuman:"],
      prompt: `\n\nHuman: ${prompt}`,
    };

    try {
      const response = await invokeBedrock(JSON.stringify(payload));
      if (!response) {
        console.error('response is null');
        addNotification({
          type: 'error',
          content: '議事録の生成に失敗しました。再度お試しください。',
          dismissible: true,
          onDismiss: () => removeNotification('generate-error'),
          id: 'generate-error',
        });
        setIsGenerating(false);
        return;
      }

      let completion = '';
      if (response.body) {
        for await (const event of response.body) {
          if (event.contentBlockDelta?.delta?.text) {
            completion += event.contentBlockDelta.delta.text;
            setMinutesText(completion);
          }
        }
      }
      
      addNotification({
        type: 'success',
        content: '議事録の生成が完了しました',
        dismissible: true,
        onDismiss: () => removeNotification('generate-success'),
        id: 'generate-success',
      });
    } catch (error) {
      console.error('Error generating minutes:', error);
      addNotification({
        type: 'error',
        content: `議事録の生成に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`,
        dismissible: true,
        onDismiss: () => removeNotification('generate-error'),
        id: 'generate-error',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const exportMinutes = () => {
    if (!minutesText) return;
    
    const blob = new Blob([minutesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().split('T')[0];
    link.download = `議事録_${date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 成功通知の表示
    addNotification({
      type: 'success',
      content: '議事録をダウンロードしました',
      dismissible: true,
      onDismiss: () => removeNotification('download-success'),
      id: 'download-success',
    });
  };
  
  // クリップボードにコピーする関数
  const copyToClipboard = async () => {
    if (!minutesText) return;
    
    try {
      await navigator.clipboard.writeText(minutesText);
      
      // 成功通知の表示
      addNotification({
        type: 'success',
        content: '議事録をクリップボードにコピーしました',
        dismissible: true,
        onDismiss: () => removeNotification('copy-success'),
        id: 'copy-success',
      });
    } catch (error) {
      console.error('クリップボードへのコピーに失敗しました:', error);
      
      // エラー通知の表示
      addNotification({
        type: 'error',
        content: 'クリップボードへのコピーに失敗しました',
        dismissible: true,
        onDismiss: () => removeNotification('copy-error'),
        id: 'copy-error',
      });
    }
  };
  
  // 通知を追加する関数
  const addNotification = (notification: FlashbarProps.MessageDefinition) => {
    // 既存の同じIDの通知を削除
    removeNotification(notification.id as string);
    
    setNotifications(prevNotifications => [...prevNotifications, notification]);
    
    // 3秒後に自動で消す
    setTimeout(() => {
      removeNotification(notification.id as string);
    }, 3000);
  };
  
  // 通知を削除する関数
  const removeNotification = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  
  return (
    <SpaceBetween size="l">
      {/* 通知バー */}
      {notifications.length > 0 && (
        <Flashbar items={notifications} />
      )}
      
      <Container
        header={
          <Header variant="h3">
            文字起こしデータ入力
          </Header>
        }
      >
        <FormField label="文字起こしデータを入力してください">
          <Textarea
            value={transcriptText}
            onChange={event => handleTranscriptChange(event.detail.value)}
            rows={10}
          />
        </FormField>
        <Box margin={{ top: 'l' }}>
          <Button
            onClick={generateMinutes}
            loading={isGenerating}
            variant="primary"
          >
            議事録生成
          </Button>
        </Box>
      </Container>

      <Container
        header={
          <Header variant="h3">
            生成された議事録
          </Header>
        }
      >
        <Box
          padding="l"
          variant="p"
          fontSize={props.fontSize?.value as BoxProps.FontSize}
        >
          {minutesText ? (
            <div style={{ whiteSpace: 'pre-wrap' }}>{minutesText}</div>
          ) : (
            '議事録が生成されるとここに表示されます'
          )}
        </Box>
        {minutesText && (
          <Box margin={{ top: 'l' }}>
            <SpaceBetween direction="horizontal" size="xs">
              <Button 
                onClick={exportMinutes}
                iconName="download"
              >
                ダウンロード
              </Button>
              <Button 
                onClick={copyToClipboard}
                iconName="copy"
              >
                クリップボードにコピー
              </Button>
            </SpaceBetween>
          </Box>
        )}
      </Container>
    </SpaceBetween>
  );
};

export default MinutesContainer;
