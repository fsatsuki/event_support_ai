import { 
  BedrockRuntimeClient, 
  ConverseStreamCommand
} from "@aws-sdk/client-bedrock-runtime";

import { Auth } from 'aws-amplify';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { ConverseCommandParams, ConversationRole } from '../types/bedrock';


const region = import.meta.env.VITE_APP_REGION;
const cognito = new CognitoIdentityClient({ region });
const userPoolId = import.meta.env.VITE_APP_USER_POOL_ID;
const idPoolId = import.meta.env.VITE_APP_IDENTITY_POOL_ID;
const providerName = `cognito-idp.${region}.amazonaws.com/${userPoolId}`;


const getBedrockClient = async () =>{
  const data  = await Auth.currentSession()
  return new BedrockRuntimeClient({
    region,
    credentials: fromCognitoIdentityPool({
      client: cognito,
      identityPoolId: idPoolId,
      logins: {
        [providerName]: data.getIdToken().getJwtToken(),
      },
    }),
  })
}

const useBedrock = () => {
  const invokeBedrock = async (body: string, modelId?: string) => {
    console.log(body)
    try{
      const bedrockClient = await getBedrockClient()
      
      // JSONからデータを解析
      const parsedBody = JSON.parse(body);
      const prompt = parsedBody.prompt;
      const inferenceConfig = {
        maxTokens: parsedBody.max_tokens_to_sample || 4000,
        temperature: parsedBody.temperature || 0.7,
        topP: parsedBody.top_p || 0.999,
        stopSequences: parsedBody.stop_sequences || []
      };
      
      // Humanプロンプト部分を抽出
      const humanPrompt = prompt.replace('\n\nHuman: ', '');
      
      // ConverseStreamCommand用のパラメーターを作成
      const commandParams: ConverseCommandParams = {
        modelId: modelId || "us.anthropic.claude-3-5-haiku-20241022-v1:0",
        messages: [
          {
            role: "user" as ConversationRole,
            content: [
              {
                text: humanPrompt
              }
            ]
          }
        ],
        inferenceConfig: inferenceConfig
      };
      
      const response = await bedrockClient.send(
        new ConverseStreamCommand(commandParams)
      );
      
      // レスポンスを適切な形に変換してreturn
      // ConverseStreamCommandOutputの実際の構造に合わせる
      return {
        body: response.stream
      };
    } catch (e) {
      console.error(e)
      throw e;
    }
  }


  return {
    invokeBedrock
  }
}

export default useBedrock;
