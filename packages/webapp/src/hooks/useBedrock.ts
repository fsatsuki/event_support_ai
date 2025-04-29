import { 
  BedrockRuntimeClient, 
  // InvokeModelCommand,
  InvokeModelWithResponseStreamCommand,
  InvokeModelWithResponseStreamCommandOutput,
  // InvokeModelCommandOutput,
} from "@aws-sdk/client-bedrock-runtime";

import { Auth } from 'aws-amplify';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';


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
  const invokeBedrock = async (body: string) => {
    console.log(body)
    try{
      const bedrockClient = await getBedrockClient()
      const response:InvokeModelWithResponseStreamCommandOutput = await bedrockClient.send(new InvokeModelWithResponseStreamCommand({
        body: body,
        contentType: "application/json",
        modelId: "us.anthropic.claude-3-5-haiku-20241022-v1:0"
      }))
  
      return response
    }catch (e){
      console.error(e)
    }
  }


  return {
    invokeBedrock
  }
}

export default useBedrock;