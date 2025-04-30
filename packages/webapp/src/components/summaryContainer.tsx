import { useEffect, useMemo, useState, useRef } from 'react';
import {
  Box,
  BoxProps,
  SpaceBetween,
  SelectProps,
} from '@cloudscape-design/components';
import {
  LanguageCode
} from "@aws-sdk/client-transcribe-streaming";

import useBedrock from  '../hooks/useBedrock';
import { getPrompter } from '../prompts';


type transcript = {
  isPartial: boolean;
  transcript: string;
}

type destLanguage = {
  label: string;
  translateCode?: string;
  transcribeCode?: LanguageCode;
}

interface Props{
  transcripts: transcript[]
  destLanguage: destLanguage
  fontSize: SelectProps.Option
  activeFlag: boolean
}

// 環境変数が存在しない場合にデフォルト値を設定
const modelId = import.meta.env.VITE_APP_MODEL_ID || 'anthropic.claude-3-5-haiku-20241022-v1:0';

const SummaryContainer: React.FC<Props> = (props) => {
  
  const { invokeBedrock } = useBedrock()
  const [summarizedText, setSummarizedText] = useState<string>();
  
  // props.transcripts 要素に入力された値を ref で持ち直す
  const inputVal = useRef("");
  const activeFlag = useRef(true);

  const prompter = useMemo(() => {
    return getPrompter(modelId);
  }, []);

  useEffect(() => {
    // props.transcriptsの値を逐次更新してuseRefに入れる
    inputVal.current = props.transcripts.map(({ transcript }) => transcript).join('')
  }, [props.transcripts])


  useEffect(() => {
    // props.activeFlagの値を逐次更新してuseRefに入れる
    activeFlag.current = props.activeFlag
  }, [props.activeFlag])

  useEffect(() => {
    const interval = setInterval(async() => {
      if (!activeFlag.current){
        return
      }

      // プロンプト生成
      const prompt = prompter.summarizePrompt({
        sentence: inputVal.current,
      })

      const payload = {
        max_tokens_to_sample: 2000,
        temperature: 0.999,
        top_k: 250,
        top_p: 1,
        stop_sequences: ["\n\nHuman:"],
        prompt: `\n\nHuman: ${prompt}`,
      }

      const response = await invokeBedrock(JSON.stringify(payload))
      if (!response){
        console.error("response is null")
        return
      }
      
      let completion = "";
      if (response.body) {
        for await (const event of response.body) {
          if (event.contentBlockDelta?.delta?.text) {
            completion += event.contentBlockDelta.delta.text;
            setSummarizedText(completion);
          }
        }
      }
      }, 1000 * 60);
      return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <SpaceBetween size="s">
      <Box 
        variant="p"
        fontSize={
          props.fontSize?.value as BoxProps.FontSize 
        }
      >
        {summarizedText ? summarizedText : "ここに要約結果を表示します"}
      </Box>
    </SpaceBetween>
    
  );
}

export default SummaryContainer
