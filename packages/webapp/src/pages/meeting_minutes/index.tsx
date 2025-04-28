import { useState } from "react";
import {
  AppLayout,
  Box,
  Container,
  ContentLayout,
  Grid,
  Header,
  Select,
  SelectProps,
  SpaceBetween,
  TextContent,
} from '@cloudscape-design/components';

import MinutesContainer from "../../components/minutesContainer";

export default function App() {
  const fontSizes = [
    "body-s",
    "body-m",
    "heading-xs",
    "heading-s",
    "heading-m",
    "heading-l",
    "heading-xl",
    "display-l"
  ];

  const [fontSize, setFontSize] = useState<SelectProps.Option>({ label: "body-m", value: "body-m" });

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
            <Container>
              <Grid
                gridDefinition={[
                  { colspan: { default: 12, xxs: 4 } }
                ]}
              >
                <div>
                  <TextContent>
                    <p>フォントサイズ</p>
                  </TextContent>
                  <Select
                    selectedOption={fontSize ?? null}
                    options={fontSizes.map((fontSize) => (
                      { label: fontSize, value: fontSize }
                    ))}
                    onChange={(value) => setFontSize(
                      value.detail.selectedOption ?? null
                    )}
                  />
                </div>
              </Grid>
            </Container>

            <Box margin={{ bottom: "l" }}>
              <MinutesContainer fontSize={fontSize} />
            </Box>
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}