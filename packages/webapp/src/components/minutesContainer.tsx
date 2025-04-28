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

  const prompter = getPrompter(modelId);

  const handleTranscriptChange = (value: string) => {
    setTranscriptText(value);
  };

  const generateMinutes = async () => {
    if (!transcriptText.trim()) {
      return;
    }

    setIsGenerating(true);

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
        setIsGenerating(false);
        return;
      }

      let completion = '';
      if (response.body) {
        const textDecoder = new TextDecoder('utf-8');

        for await (const stream of response.body) {
          const chunk = textDecoder.decode(stream.chunk?.bytes);
          completion = completion + JSON.parse(chunk)['completion'];
          setMinutesText(completion);
        }
      }
    } catch (error) {
      console.error('Error generating minutes:', error);
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
  };

  return (
    <SpaceBetween size="l">
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
            <Button onClick={exportMinutes}>議事録をエクスポート</Button>
          </Box>
        )}
      </Container>
    </SpaceBetween>
  );
};

export default MinutesContainer;