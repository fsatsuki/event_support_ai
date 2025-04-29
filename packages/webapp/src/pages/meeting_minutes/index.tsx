import {
  AppLayout,
  Box,
  ContentLayout,
  Header,
  SpaceBetween,
} from '@cloudscape-design/components';

import MinutesContainer from "../../components/minutesContainer";

export default function App() {
  // デフォルトのフォントサイズを固定値として設定
  const defaultFontSize = { label: "body-m", value: "body-m" };

  return (
    <AppLayout
      maxContentWidth={Number.MAX_VALUE}
      toolsHide={true}
      navigationHide={true}
      content={
        <ContentLayout
          header={
            <Header variant="h1">
              議事録生成
            </Header>
          }
        >
          <SpaceBetween size="l">
            <Box margin={{ bottom: "l" }}>
              <MinutesContainer fontSize={defaultFontSize} />
            </Box>
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}